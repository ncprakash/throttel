// app/api/admin/products/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { requireAdmin } from "@/lib/admin-auth";
import { productSchema } from "@/lib/schemas";

// Optional: verify schema is loaded
if (!productSchema) {
  throw new Error("productSchema is not defined – check your schemas.ts export");
}

export async function GET(request: NextRequest) {
  const authError = await requireAdmin();
  if (authError) return authError;
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

    if (categoryId) query = query.eq("category_id", categoryId);
    if (isFeatured === "true") query = query.eq("is_featured", true);
    if (search) query = query.ilike("name", `%${search}%`);

    const { data, error, count } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ products: data, total: count, limit, offset });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to fetch products";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const authError = await requireAdmin();
    if (authError) return authError;

    const body = await request.json();
    console.log("POST /api/admin/products body:", body);

    // ✅ Now productSchema will be defined
    const parsed = productSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const {
      category_id, name, slug, short_description, description,
      regular_price, sale_price, sku, stock_quantity, is_active,
      is_featured, warranty_months, material, technical_specification,
      reviews, weight, fitment_guide,
    } = parsed.data;

    // Check if category exists
    if (category_id) {
      const { data: category, error: catError } = await supabase
        .from("categories")
        .select("category_id")
        .eq("category_id", category_id)
        .single();

      if (catError || !category) {
        return NextResponse.json({ error: "Invalid category_id" }, { status: 400 });
      }
    }

    // Check slug uniqueness
    const { data: existing, error: slugError } = await supabase
      .from("products")
      .select("product_id")
      .eq("slug", slug)
      .maybeSingle(); // ✅ Use maybeSingle() to avoid PGRST116 error

    if (slugError) {
      console.error("Slug check error:", slugError);
      return NextResponse.json({ error: "Error checking slug uniqueness" }, { status: 500 });
    }
    if (existing) {
      return NextResponse.json({ error: "Product with this slug already exists" }, { status: 400 });
    }

    const insertData: Record<string, unknown> = {
      category_id, name, slug, description, short_description,
      regular_price, sku,
      stock_quantity: stock_quantity ?? 0,
      is_active: is_active ?? true,
      is_featured: is_featured ?? false,
      weight,
      warranty_months: warranty_months ?? 6,
      material,
      reviews: Array.isArray(reviews) ? reviews : (reviews ? [reviews] : []),
      technical_specification: Array.isArray(technical_specification)
        ? technical_specification
        : (technical_specification ? [technical_specification] : []),
    };
    if (sale_price !== undefined && sale_price !== null) insertData.sale_price = sale_price;
    if (fitment_guide) insertData.fitment_guide = fitment_guide;

    const { data, error } = await supabase
      .from("products")
      .insert([insertData])
      .select();

    if (error) {
      console.error("Product insert failed:", error);
      return NextResponse.json({
        error: "Failed to create product",
        details: error.message,
      }, { status: 500 });
    }

    const insertedProduct = data?.[0] ?? null;
    return NextResponse.json(
      { message: "Product created successfully", product: insertedProduct },
      { status: 201 }
    );
  } catch (err: unknown) {
    console.error("POST /api/admin/products unexpected error:", err);
    const message = err instanceof Error ? err.message : "Something went wrong";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}