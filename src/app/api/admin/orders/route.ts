// app/api/admin/orders/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Number(searchParams.get("limit") ?? 50);
    const offset = Number(searchParams.get("offset") ?? 0);

    const { data, error } = await supabase
      .from("orders")
      .select(`
        order_id,
        order_number,
        status,
        payment_method,
        payment_status,
        subtotal,
        shipping_charges,
        tax_amount,
        discount_amount,
        total_amount,
        notes,
        cancellation_reason,
        cancelled_at,
        created_at,
        updated_at,
        users (
          user_id,
          email,
          first_name,
          last_name,
          phone,
          role
        ),
        order_items (
          order_item_id,
          product_id,
          variant_id,
          product_name,
          variant_name,
          quantity,
          unit_price,
          total_price,
          created_at
        )
      `)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const uniqueOrders = Array.from(
      new Map((data ?? []).map((order: any) => [order.order_id, order]))
        .values()
    );

    return NextResponse.json({ orders: uniqueOrders });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
