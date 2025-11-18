// app/api/orders/verify-payment/route.ts
import { NextRequest, NextResponse } from "next/server";
import {supabase} from '@/lib/supabase'
import crypto from "crypto";
import axios from "axios";


export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      order_id,
    } = body;

    // Verify signature
    const text = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(text)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json(
        { success: false, error: "Invalid payment signature" },
        { status: 400 }
      );
    }

    // Update order payment status
    const { data: order, error: updateError } = await supabase
      .from("orders")
      .update({
        payment_status: "completed",
        status: "confirmed",
        updated_at: new Date().toISOString(),
      })
      .eq("order_id", order_id)
      .select()
      .single();

    if (updateError) {
      console.error("Order update error:", updateError);
      return NextResponse.json(
        { success: false, error: "Failed to update order" },
        { status: 500 }
      );
    }

    // Add tracking entry
    await supabase.from("order_tracking").insert({
      order_id: order.order_id,
      status: "payment_confirmed",
      message: "Payment successfully received",
    });

    // Create Shiprocket order
    try {
      const shiprocketResult = await createShiprocketOrder(order.order_id);
      
      return NextResponse.json({
        success: true,
        order_id: order.order_id,
        shipment_id: shiprocketResult.shipment_id,
      });
    } catch (shipError) {
      console.error("Shiprocket creation failed:", shipError);
      // Payment is verified, but shipping failed - still return success
      return NextResponse.json({
        success: true,
        order_id: order.order_id,
        warning: "Order created but shipping setup failed",
      });
    }
  } catch (error: any) {
    console.error("Payment verification error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// Helper function to create Shiprocket order
async function createShiprocketOrder(order_id: string) {
  // Get Shiprocket token
  const tokenRes = await axios.post(
    "https://apiv2.shiprocket.in/v1/external/auth/login",
    {
      email: process.env.SHIPROCKET_EMAIL,
      password: process.env.SHIPROCKET_PASSWORD,
    }
  );

  const token = tokenRes.data.token;

  // Fetch order details
  const { data: order } = await supabase
    .from("orders")
    .select(
      `
      *,
      order_items (*),
      shipping_address:shipping_address_id (*),
      users (*)
    `
    )
    .eq("order_id", order_id)
    .single();

  // Create Shiprocket order
  const shiprocketPayload = {
    order_id: order.order_number,
    order_date: new Date().toISOString().split("T")[0],
    pickup_location: "Primary",
    billing_customer_name: order.users.name?.split(" ")[0] || "Customer",
    billing_last_name: order.users.name?.split(" ")[1] || "",
    billing_address: order.shipping_address.address_line1,
    billing_city: order.shipping_address.city,
    billing_pincode: order.shipping_address.postal_code,
    billing_state: order.shipping_address.state,
    billing_country: order.shipping_address.country,
    billing_email: order.users.email,
    billing_phone: order.users.phone || "9999999999",
    shipping_is_billing: true,
    order_items: order.order_items.map((item: any) => ({
      name: item.product_name,
      sku: item.product_id,
      units: item.quantity,
      selling_price: parseFloat(item.unit_price),
    })),
    payment_method: "Prepaid",
    sub_total: parseFloat(order.subtotal),
    length: 10,
    breadth: 10,
    height: 10,
    weight: 0.5,
  };

  const shipRes = await axios.post(
    "https://apiv2.shiprocket.in/v1/external/orders/create/adhoc",
    shiprocketPayload,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  // Update order tracking
  await supabase.from("order_tracking").insert({
    order_id: order.order_id,
    status: "shipment_created",
    message: "Shipment created successfully",
    tracking_number: shipRes.data.awb_code,
    courier_name: shipRes.data.courier_name,
  });

  return {
    shipment_id: shipRes.data.shipment_id,
    awb_code: shipRes.data.awb_code,
  };
}
