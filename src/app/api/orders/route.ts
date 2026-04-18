// app/api/orders/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

function generateOrderNumber() {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, "0");
  return `ORD-${timestamp}-${random}`;
}

interface CartItem {
  product_id?: string;
  variant_id?: string;
  quantity: number;
  product?: { name?: string; sale_price?: number; regular_price?: number };
  variant?: { name?: string; additional_price?: number };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const user_id = searchParams.get("user_id");

    if (!user_id) {
      return NextResponse.json({ error: "user_id is required" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("orders")
      .select(`
        order_id,
        order_number,
        status,
        payment_status,
        total_amount,
        created_at,
        shiprocket_order_id,
        order_items (
          product_name,
          variant_name,
          quantity,
          unit_price,
          total_price
        )
      `)
      .eq("user_id", user_id)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ orders: data ?? [] });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to fetch orders";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      user_id, customer_name, customer_email, customer_phone,
      shipping_address, shipping_city, shipping_state,
      shipping_postal_code, shipping_country,
      payment_method, items, subtotal, shipping_cost, total_amount,
    } = body;

    if (!customer_email || !customer_name) {
      return NextResponse.json(
        { error: "Customer name and email are required" },
        { status: 400 }
      );
    }

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: "Order must contain at least one item" },
        { status: 400 }
      );
    }

    const orderNumber = generateOrderNumber();

    const notesContent = [
      `Customer: ${customer_name}`,
      `Email: ${customer_email}`,
      customer_phone ? `Phone: ${customer_phone}` : null,
      shipping_address ? `Address: ${shipping_address}` : null,
      shipping_city ? `City: ${shipping_city}` : null,
      shipping_state ? `State: ${shipping_state}` : null,
      shipping_postal_code ? `Postal Code: ${shipping_postal_code}` : null,
      shipping_country ? `Country: ${shipping_country}` : null,
    ]
      .filter(Boolean)
      .join(", ");

    const orderData = {
      order_number: orderNumber,
      user_id: user_id || null,
      status: "pending",
      payment_method: payment_method || "cod",
      payment_status: "pending",
      subtotal: Number(subtotal) || 0,
      shipping_charges: Number(shipping_cost) || 0,
      tax_amount: null,
      discount_amount: 0,
      total_amount: Number(total_amount) || 0,
      notes: notesContent,
      cancellation_reason: null,
      cancelled_at: null,
      shipping_address_id: null,
      billing_address_id: null,
    };

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert(orderData)
      .select()
      .single();

    if (orderError) {
      return NextResponse.json(
        { error: "Failed to create order", details: orderError.message },
        { status: 500 }
      );
    }

    const orderItems = (items as CartItem[]).map((item) => {
      const productPrice = item.product?.sale_price ?? item.product?.regular_price ?? 0;
      const variantPrice = item.variant?.additional_price || 0;
      const unitPrice = productPrice + variantPrice;

      return {
        order_id: order.order_id,
        product_id: item.product_id || null,
        variant_id: item.variant_id || null,
        product_name: item.product?.name || "Unknown Product",
        variant_name: item.variant?.name || null,
        quantity: Number(item.quantity) || 1,
        unit_price: Number(unitPrice) || 0,
        total_price: Number(unitPrice * item.quantity) || 0,
      };
    });

    const { data: orderItemsData, error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItems)
      .select();

    if (itemsError) {
      await supabase.from("orders").delete().eq("order_id", order.order_id);
      return NextResponse.json(
        { error: "Failed to create order items", details: itemsError.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, order: { ...order, items: orderItemsData }, message: "Order placed successfully" },
      { status: 201 }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to create order";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
