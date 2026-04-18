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

interface OrderItem {
  product_id?: string;
  variant_id?: string;
  product_name: string;
  variant_name?: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

async function createRazorpayAndItems(
  order: { order_id: string; order_number: string },
  items: OrderItem[],
  total_amount: number,
  customer_name: string,
  customer_email: string
) {
  const razorpayOrder = await razorpay.orders.create({
    amount: Math.round(total_amount * 100),
    currency: "INR",
    receipt: order.order_number,
    notes: { order_id: order.order_id, customer_name, customer_email },
  });

  const orderItems = items.map((item) => ({
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

  return NextResponse.json({
    success: true,
    order_id: order.order_id,
    razorpay_order_id: razorpayOrder.id,
    amount: razorpayOrder.amount,
    currency: razorpayOrder.currency,
    order,
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      user_id, customer_name, customer_email, customer_phone,
      shipping_address, shipping_city, shipping_state,
      shipping_postal_code, shipping_country,
      items, subtotal, shipping_charges, tax_amount, total_amount,
    } = body;

    if (!customer_email || !customer_name || !items?.length) {
      return NextResponse.json({ error: "Invalid order data" }, { status: 400 });
    }

    const orderNumber = generateOrderNumber();

    const orderData = {
      order_number: orderNumber,
      user_id: user_id || null,
      status: "pending",
      payment_method: "razorpay",
      payment_status: "pending",
      subtotal: Number(subtotal),
      shipping_charges: Number(shipping_charges) || 0,
      tax_amount: Number(tax_amount) || 0,
      total_amount: Number(total_amount),
      customer_name,
      customer_email,
      customer_phone: customer_phone || "",
      shipping_address: shipping_address || "",
      shipping_city: shipping_city || "",
      shipping_state: shipping_state || "",
      shipping_postal_code: shipping_postal_code || "",
      shipping_country: shipping_country || "India",
      notes: `${customer_name}, ${customer_email}, ${customer_phone || ""}, ${shipping_address || ""}, ${shipping_city || ""}, ${shipping_state || ""}, ${shipping_postal_code || ""}`,
    };

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert(orderData)
      .select()
      .single();

    if (orderError || !order) {
      // If columns don't exist yet, fall back to notes-only version
      if (orderError?.code === "42703") {
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
            customer_name, customer_email, customer_phone,
            shipping_address, shipping_city, shipping_state,
            shipping_postal_code, shipping_country,
          }),
        };

        const { data: fallbackOrder, error: fallbackError } = await supabase
          .from("orders")
          .insert(fallbackData)
          .select()
          .single();

        if (fallbackError || !fallbackOrder) {
          return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
        }

        return await createRazorpayAndItems(fallbackOrder, items, total_amount, customer_name, customer_email);
      }

      return NextResponse.json(
        { error: "Failed to create order", details: orderError?.message },
        { status: 500 }
      );
    }

    return await createRazorpayAndItems(order, items, total_amount, customer_name, customer_email);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Something went wrong";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
