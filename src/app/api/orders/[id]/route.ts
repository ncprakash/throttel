// app/api/orders/[id]/route.ts
import { NextRequest } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { data: order, error } = await supabase
      .from("orders")
      .select(`
        *,
        shiprocket_order_id,
        order_items (
          product_name,
          variant_name,
          quantity,
          unit_price,
          total_price
        )
      `)
      .eq("order_id", id)
      .single();

    if (error || !order) {
      return Response.json(
        { error: error?.message || "Order not found" },
        { status: 404 }
      );
    }

    return Response.json(order);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Server error";
    return Response.json({ error: message }, { status: 500 });
  }
}
