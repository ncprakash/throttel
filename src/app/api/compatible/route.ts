// app/api/compatible/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const product_id = searchParams.get("product_id");

    let query = supabase
      .from("product_compatibility")
      .select(`
        compatibility_id,
        product_id,
        bike_model,
        bike_brand,
        year_from,
        year_to,
        notes
      `);

    if (product_id) {
      query = query.eq("product_id", product_id);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: "Failed to fetch product compatibility" }, { status: 500 });
    }

    return NextResponse.json({ success: true, compatibility: data }, { status: 200 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
