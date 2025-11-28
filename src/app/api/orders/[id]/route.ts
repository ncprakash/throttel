// app/api/orders/[id]/route.ts
import { NextRequest } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(
  request: NextRequest,
   { params }: { params: Promise<{ id: string }> }  
) {
  try {
    const { id } =  await  params;

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
      .eq("user_id", id)
      .single();

    if (error || !order) {
      return new Response(null, { status: 404 });
    }

    return Response.json(order);
  } catch (error) {
    return new Response(null, { status: 500 });
  }
}
