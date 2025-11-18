// app/api/orders/create/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import Razorpay from "razorpay";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      user_id,
      customer_name,
      customer_email,
      customer_phone,
      shipping_address,
      shipping_city,
      shipping_state,
      shipping_postal_code,
      shipping_country,
      payment_method,
      shipping_method,
      items,
      subtotal,
      shipping_charges,
      tax_amount,
      total_amount,
    } = body;

    // Validate required fields
    if (!user_id || !customer_email || !items || items.length === 0) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Generate unique order number
    const order_number = `ORD${Date.now()}${Math.floor(Math.random() * 1000)}`;

    // Create or get shipping address
    const { data: shippingAddr, error: addrError } = await supabase
      .from("addresses")
      .insert({
        user_id,
        address_line1: shipping_address,
        city: shipping_city,
        state: shipping_state,
        postal_code: shipping_postal_code,
        country: shipping_country,
        is_default: false,
      })
      .select()
      .single();

    if (addrError) {
      console.error("Address creation error:", addrError);
      return NextResponse.json(
        { error: "Failed to create address", details: addrError.message },
        { status: 500 }
      );
    }

    // Create order in database
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id,
        order_number,
        status: "pending",
        payment_method,
        payment_status: "pending",
        subtotal,
        shipping_charges,
        tax_amount,
        discount_amount: 0,
        total_amount,
        shipping_address_id: shippingAddr.address_id,
        billing_address_id: shippingAddr.address_id,
      })
      .select()
      .single();

    if (orderError) {
      console.error("Order creation error:", orderError);
      return NextResponse.json(
        { error: "Failed to create order", details: orderError.message },
        { status: 500 }
      );
    }

    // Insert order items
    const orderItems = items.map((item: any) => ({
      order_id: order.order_id,
      product_id: item.product_id,
      variant_id: item.variant_id,
      product_name: item.product_name,
      variant_name: item.variant_name,
      quantity: item.quantity,
      unit_price: item.unit_price,
      total_price: item.total_price,
    }));

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItems);

    if (itemsError) {
      console.error("Order items error:", itemsError);
      return NextResponse.json(
        { error: "Failed to create order items", details: itemsError.message },
        { status: 500 }
      );
    }

    // Create initial tracking entry
    await supabase.from("order_tracking").insert({
      order_id: order.order_id,
      status: "order_created",
      message: "Order has been created",
    });

    // Create Razorpay order if payment method is razorpay
    let razorpayOrder = null;
    if (payment_method === "razorpay") {
      razorpayOrder = await razorpay.orders.create({
        amount: Math.round(total_amount * 100), // Convert to paise
        currency: "INR",
        receipt: order_number,
        notes: {
          order_id: order.order_id,
          order_number: order_number,
          customer_name,
          customer_email,
        },
      });

      // Update order with Razorpay order ID
      await supabase
        .from("orders")
        .update({
          notes: JSON.stringify({ razorpay_order_id: razorpayOrder.id }),
        })
        .eq("order_id", order.order_id);
    }

    return NextResponse.json({
      success: true,
      order_id: order.order_id,
      order_number: order.order_number,
      razorpay_order_id: razorpayOrder?.id,
      amount: razorpayOrder?.amount,
      currency: razorpayOrder?.currency || "INR",
    });
  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
