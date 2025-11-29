// app/api/compatible/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase"; // adjust import if your client path is different

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const product_id = searchParams.get("product_id");

    let query = supabase
      .from("product_compatibility")
      .select(
        `
        compatibility_id,
        product_id,
        bike_model,
        bike_brand,
        year_from,
        year_to,
        notes
      `
      );

    if (product_id) {
      query = query.eq("product_id", product_id);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching compatibility:", error);
      return NextResponse.json(
        { error: "Failed to fetch product compatibility" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        compatibility: data,
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("Unhandled error in /api/compatible:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
