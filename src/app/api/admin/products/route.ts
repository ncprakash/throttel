// app/api/products/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get("category_id");
    const isFeatured = searchParams.get("is_featured");
    const search = searchParams.get("search");
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = parseInt(searchParams.get("offset") || "0");

    let query = supabase
      .from("products")
      .select(`
        *,
        categories(category_id, name, slug),
        product_images(image_id, image_url, alt_text, is_primary, display_order)
      `, { count: "exact" })
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (categoryId) {
      query = query.eq("category_id", categoryId);
    }

    if (isFeatured === "true") {
      query = query.eq("is_featured", true);
    }

    if (search) {
      query = query.ilike("name", `%${search}%`);
    }

    const { data, error, count } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      products: data,
      total: count,
      limit,
      offset,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      category_id,
      name,
      slug,
      short_description,
      description,
      regular_price,
      sale_price,
      sku,
      stock_quantity,
      is_active,
      is_featured,
      warranty_months,
      material,
      techincal_specification, // Matches exact DB column name (typo preserved)
      reviews,
      // Map frontend fields to exact DB columns
      weight,
      fitment_guide, // DB has fitment_guide, frontend might send as filament or reviews
    } = body;

    // Basic validation - required fields
    if (!name || !slug || regular_price == null) {
      return NextResponse.json(
        { error: "name, slug, and regular_price are required" },
        { status: 400 }
      );
    }

    // Insert matching exact DB schema
    const { data, error } = await supabase
      .from("products")
      .insert([
        {
          category_id,
          name,
          slug,
          short_description,
          description,
          regular_price,
          sale_price,
          sku,
          stock_quantity: stock_quantity ?? 0,
          is_active: is_active ?? true,
          is_featured: is_featured ?? false,
          weight,
          warranty_months: warranty_months ?? 6,
          techincal_specification, // Exact DB spelling
          fitment_guide, // DB column
          material,
          reviews: reviews || [], // jsonb[] default empty array
        }
      ])
      .select();

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Product created successfully", product: data[0] },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("POST /api/products error:", err);
    return NextResponse.json(
      { error: err.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
