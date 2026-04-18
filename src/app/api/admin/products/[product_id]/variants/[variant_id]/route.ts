// app/api/admin/products/[product_id]/variants/[variant_id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { requireAdmin } from "@/lib/admin-auth";

type RouteParams = {
  params: Promise<{ product_id: string; variant_id: string }>;
};

export async function PATCH(request: NextRequest, context: RouteParams) {
  const authError = await requireAdmin();
  if (authError) return authError;
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
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update variant";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
