// app/api/admin/products/[product_id]/compatibility/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ product_id: string }> }  // ✅ Changed to Promise
) {
  try {
    // ✅ CRITICAL: Await params
    const { product_id } = await params;
    const body = await request.json();

    // 🔍 DEBUG
    console.log("=== Compatibility API ===");
    console.log("Received product_id:", product_id);
    console.log("Body:", body);

    if (!product_id || product_id === "undefined" || product_id === "null") {
      console.error("❌ Invalid product_id:", product_id);
      return NextResponse.json(
        { error: "Invalid product_id" },
        { status: 400 }
      );
    }

    if (!body.bike_model?.trim()) {
      return NextResponse.json(
        { error: "bike_model is required" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("product_compatibility")
      .insert({
        product_id: product_id,  // ✅ Now correct
        bike_brand: body.bike_brand || null,
        bike_model: body.bike_model,
        year_from: body.year_from || null,
        year_to: body.year_to || null,
        notes: body.notes || null,
      })
      .select()
      .single();

    if (error) {
      console.error("❌ Database error:", error);
      return NextResponse.json(
        { error: "Failed to save compatibility", details: error.message },
        { status: 500 }
      );
    }

    console.log("✅ Compatibility saved:", data);
    console.log("=========================");

    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    console.error("❌ Compatibility error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to save compatibility" },
      { status: 500 }
    );
  }
}
