import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Allow single object or array
    const items = Array.isArray(body) ? body : [body];

    if (!items.length) {
      return NextResponse.json(
        { error: "No order items provided" },
        { status: 400 }
      );
    }

    // Basic validation
    for (const it of items) {
      if (!it.order_id || !it.product_id || !it.product_name) {
        return NextResponse.json(
          { error: "order_id, product_id, product_name are required" },
          { status: 400 }
        );
      }
      if (typeof it.quantity !== "number" || typeof it.unit_price !== "number") {
        return NextResponse.json(
          { error: "quantity and unit_price must be numbers" },
          { status: 400 }
        );
      }
    }

    const payload = items.map((it) => ({
      order_id: it.order_id,
      product_id: it.product_id,
      variant_id: it.variant_id ?? null,
      product_name: it.product_name,
      variant_name: it.variant_name ?? null,
      quantity: it.quantity,
      unit_price: it.unit_price,
      total_price: it.total_price ?? it.unit_price * it.quantity,
    }));

    const { data, error } = await supabase
      .from("order_items")
      .insert(payload)
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ order_items: data }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to create order items" },
      { status: 500 }
    );
  }
}
