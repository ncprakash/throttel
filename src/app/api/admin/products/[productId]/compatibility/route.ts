// app/api/admin/products/[productId]/variants/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// GET - Fetch all variants for product
export async function GET(
  request: NextRequest,
  { params }: { params: { productId: string } }
) {
  try {
    const { productId } = params;


    const { data, error } = await supabase
      .from("product_variants")
      .select("*")
      .eq("product_id", productId)
      .order("variant_name", { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ variants: data });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch variants" },
      { status: 500 }
    );
  }
}

// POST - Create variant
export async function POST(
  request: NextRequest,
  { params }: { params: { productId: string } }
) {
  try {
    const { productId } = params;
    const body = await request.json();
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("product_variants")
      .insert({
        product_id: productId,
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
