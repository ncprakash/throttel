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
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `ORD-${timestamp}-${random}`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("💳 Creating Razorpay order:", body.total_amount);

    const {
      user_id, customer_name, customer_email, customer_phone, shipping_address,
      shipping_city, shipping_state, shipping_postal_code, shipping_country,
      shipping_method, items, subtotal, shipping_charges, tax_amount, total_amount
    } = body;

    // Validation
    if (!customer_email || !customer_name || !items?.length) {
      return NextResponse.json({ error: "Invalid order data" }, { status: 400 });
    }

    // 1. Create Supabase order
    const orderNumber = generateOrderNumber();
    const orderData = {
      order_number: orderNumber,
      user_id: user_id || null,
      status: "pending",
      payment_method: "razorpay",
      payment_status: "pending",
      subtotal: Number(subtotal),
      shipping_charges: Number(shipping_charges),
      tax_amount: Number(tax_amount),
      total_amount: Number(total_amount),
      notes: `${customer_name}, ${customer_email}, ${customer_phone || ''}, ${shipping_address || ''}`,
    };

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert(orderData)
      .select()
      .single();

    if (orderError || !order) {
      return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
    }

    // 2. ALWAYS Create Razorpay order
   const razorpayOrder = await razorpay.orders.create({
  amount: Math.round(total_amount * 100),
  currency: "INR",
  receipt: order.order_number,  // <-- Use order_number (string like ORD-... < 40 chars)
  notes: { order_id: order.order_id, customer_name, customer_email },
});


    console.log("✅ Razorpay order:", razorpayOrder.id);

    // 3. Create order items
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

    await supabase.from("order_items").insert(orderItems);

    // 4. PERFECT Response for frontend
    return NextResponse.json({
      success: true,
      order_id: order.order_id,
      razorpay_order_id: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      order,
    });

  } catch (error: any) {
    console.error("❌ Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
