// app/api/admin/products/[product_id]/variants/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

type RouteParams = {
  params: Promise<{
    product_id: string;
  }>;
};

// GET /api/admin/products/[product_id]/variants
export async function GET(request: NextRequest, context: RouteParams) {
  const { product_id } = await context.params; // <- await because it's a Promise

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
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch variants" },
      { status: 500 }
    );
  }
}

// POST /api/admin/products/[product_id]/variants
export async function POST(request: NextRequest, context: RouteParams) {
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
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to create variant" },
      { status: 500 }
    );
  }
}
