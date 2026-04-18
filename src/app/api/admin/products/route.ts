// app/api/admin/products/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { requireAdmin } from "@/lib/admin-auth";
import { productSchema } from "@/lib/schemas";

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
  const authError = await requireAdmin();
  if (authError) return authError;
  try {
    const body = await request.json();
    const parsed = productSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }
    const {
      category_id, name, slug, short_description, description,
      regular_price, sale_price, sku, stock_quantity, is_active,
      is_featured, warranty_months, material, technical_specification,
      reviews, weight, fitment_guide,
    } = parsed.data;

    const { data, error } = await supabase
      .from("products")
      .insert([{
        category_id, name, slug, description, short_description,
        regular_price, sale_price, sku,
        stock_quantity: stock_quantity ?? 0,
        is_active: is_active ?? true,
        is_featured: is_featured ?? false,
        weight,
        warranty_months: warranty_months ?? 6,
        fitment_guide,
        material,
        reviews: Array.isArray(reviews) ? reviews : (reviews ? [reviews] : []),
        technical_specification: Array.isArray(technical_specification)
          ? technical_specification
          : (technical_specification ? [technical_specification] : []),
      }])
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { message: "Product created successfully", product: data[0] },
      { status: 201 }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Something went wrong";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
