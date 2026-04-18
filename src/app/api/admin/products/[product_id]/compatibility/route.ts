import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { requireAdmin } from "@/lib/admin-auth";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ product_id: string }> }
) {
  const authError = await requireAdmin();
  if (authError) return authError;
  try {
    const { product_id } = await params;
    const body = await request.json();

    if (!product_id || product_id === "undefined" || product_id === "null") {
      return NextResponse.json({ error: "Invalid product_id" }, { status: 400 });
    }

    if (!body.bike_model?.trim()) {
      return NextResponse.json({ error: "bike_model is required" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("product_compatibility")
      .insert({
        product_id,
        bike_brand: body.bike_brand || null,
        bike_model: body.bike_model,
        year_from: body.year_from || null,
        year_to: body.year_to || null,
        notes: body.notes || null,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: "Failed to save compatibility", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to save compatibility";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
