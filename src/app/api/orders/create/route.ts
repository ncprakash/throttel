// app/api/orders/create/route.ts
import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { supabase } from "@/lib/supabase";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

function generateOrderNumber() {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, "0");
  return `ORD-${timestamp}-${random}`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("💳 Creating Razorpay order:", body.total_amount);

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
      items,
      subtotal,
      shipping_charges,
      tax_amount,
      total_amount,
    } = body;

    if (!customer_email || !customer_name || !items?.length) {
      return NextResponse.json({ error: "Invalid order data" }, { status: 400 });
    }

    const orderNumber = generateOrderNumber();

    // Store ALL customer + shipping fields as individual columns
    // so verify-payment can read them back for ShipRocket
    const orderData: any = {
      order_number: orderNumber,
      user_id: user_id || null,
      status: "pending",
      payment_method: "razorpay",
      payment_status: "pending",
      subtotal: Number(subtotal),
      shipping_charges: Number(shipping_charges) || 0,
      tax_amount: Number(tax_amount) || 0,
      total_amount: Number(total_amount),
      // Customer info
      customer_name,
      customer_email,
      customer_phone: customer_phone || "",
      // Shipping address
      shipping_address: shipping_address || "",
      shipping_city: shipping_city || "",
      shipping_state: shipping_state || "",
      shipping_postal_code: shipping_postal_code || "",
      shipping_country: shipping_country || "India",
      // Keep notes as readable summary too
      notes: `${customer_name}, ${customer_email}, ${customer_phone || ""}, ${shipping_address || ""}, ${shipping_city || ""}, ${shipping_state || ""}, ${shipping_postal_code || ""}`,
    };

    console.log("📋 Order data:", JSON.stringify(orderData, null, 2));

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert(orderData)
      .select()
      .single();

    if (orderError || !order) {
      console.error("❌ Supabase order error:", orderError);

      // If columns don't exist yet, fall back to notes-only version
      if (orderError?.code === "42703") {
        console.warn("⚠️ Some columns missing in orders table — falling back to notes-only");
        const fallbackData = {
          order_number: orderNumber,
          user_id: user_id || null,
          status: "pending",
          payment_method: "razorpay",
          payment_status: "pending",
          subtotal: Number(subtotal),
          shipping_charges: Number(shipping_charges) || 0,
          tax_amount: Number(tax_amount) || 0,
          total_amount: Number(total_amount),
          notes: JSON.stringify({
            customer_name,
            customer_email,
            customer_phone,
            shipping_address,
            shipping_city,
            shipping_state,
            shipping_postal_code,
            shipping_country,
          }),
        };

        const { data: fallbackOrder, error: fallbackError } = await supabase
          .from("orders")
          .insert(fallbackData)
          .select()
          .single();

        if (fallbackError || !fallbackOrder) {
          console.error("❌ Fallback order error:", fallbackError);
          return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
        }

        return await createRazorpayAndItems(fallbackOrder, items, total_amount, customer_name, customer_email);
      }

      return NextResponse.json({ error: "Failed to create order", details: orderError?.message }, { status: 500 });
    }

    return await createRazorpayAndItems(order, items, total_amount, customer_name, customer_email);
  } catch (error: any) {
    console.error("❌ Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

async function createRazorpayAndItems(
  order: any,
  items: any[],
  total_amount: number,
  customer_name: string,
  customer_email: string
) {
  // Create Razorpay order
  const razorpayOrder = await razorpay.orders.create({
    amount: Math.round(total_amount * 100),
    currency: "INR",
    receipt: order.order_number,
    notes: { order_id: order.order_id, customer_name, customer_email },
  });

  console.log("✅ Razorpay order:", razorpayOrder.id);

  // Create order items
  const orderItems = items.map((item: any) => ({
    order_id: order.order_id,
    product_id: item.product_id || null,
    variant_id: item.variant_id || null,
    product_name: item.product_name,
    variant_name: item.variant_name || null,
    quantity: Number(item.quantity),
    unit_price: Number(item.unit_price),
    total_price: Number(item.total_price),
  }));

  const { error: itemsError } = await supabase.from("order_items").insert(orderItems);
  if (itemsError) {
    console.error("❌ Order items error:", itemsError);
  } else {
    console.log("✅ Order items created:", orderItems.length);
  }

  return NextResponse.json({
    success: true,
    order_id: order.order_id,
    razorpay_order_id: razorpayOrder.id,
    amount: razorpayOrder.amount,
    currency: razorpayOrder.currency,
    order,
  });
}