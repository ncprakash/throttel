// app/api/orders/[id]/route.ts
import { NextRequest } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    console.log("📌 API hit! id:", id); // check terminal

    const { data: order, error } = await supabase
      .from("orders")
      .select(`
        *,
        order_items (
          product_name,
          variant_name,
          quantity,
          unit_price,
          total_price
        )
      `)
      .eq("order_id", id)  // ✅ was user_id — now order_id
      .single();

    

    if (error || !order) {
      return new Response(
        JSON.stringify({ error: error?.message || "Order not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    return Response.json(order);
  } catch (err: any) {
    console.error("❌ Server error:", err);
    return new Response(
      JSON.stringify({ error: err.message || "Server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}