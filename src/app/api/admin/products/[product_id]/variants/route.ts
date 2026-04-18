// app/api/admin/products/[product_id]/variants/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { requireAdmin } from "@/lib/admin-auth";

type RouteParams = {
  params: Promise<{ product_id: string }>;
};

export async function GET(_request: Request, context: RouteParams) {
  const authError = await requireAdmin();
  if (authError) return authError;
  const { product_id } = await context.params;
  try {
    const { data, error } = await supabase
      .from("product_variants")
      .select("*")
      .eq("product_id", product_id)
      .order("variant_name", { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ variants: data ?? [] });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to fetch variants";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest, context: RouteParams) {
  const authError = await requireAdmin();
  if (authError) return authError;
  const { product_id } = await context.params;
  try {
    const body = await request.json();

    const { data, error } = await supabase
      .from("product_variants")
      .insert({
        product_id,
        variant_name: body.variant_name,
        color: body.color || null,
        size: body.size || null,
        sku: body.sku || null,
        additional_price: body.additional_price || 0,
        stock_quantity: body.stock_quantity || 0,
        is_active: body.is_active ?? true,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ variant: data }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to create variant";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
