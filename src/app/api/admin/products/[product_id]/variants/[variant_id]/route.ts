// app/api/admin/products/[product_id]/variants/[variant_id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

type RouteParams = {
  params: Promise<{
    product_id: string;
    variant_id: string;
  }>;
};

// PATCH /api/admin/products/[product_id]/variants/[variant_id]
export async function PATCH(request: NextRequest, context: RouteParams) {
  const { product_id, variant_id } = await context.params;

  try {
    const body = await request.json();

    const { data, error } = await supabase
      .from("product_variants")
      .update({
        variant_name: body.variant_name,
        color: body.color ?? null,
        size: body.size ?? null,
        sku: body.sku ?? null,
        additional_price: body.additional_price ?? 0,
        stock_quantity: body.stock_quantity ?? 0,
        is_active: body.is_active ?? true,
      })
      .eq("product_id", product_id)
      .eq("variant_id", variant_id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ variant: data }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to update variant" },
      { status: 500 }
    );
  }
}
