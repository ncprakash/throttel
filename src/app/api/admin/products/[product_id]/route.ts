// app/api/admin/products/[product_id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { requireAdmin } from "@/lib/admin-auth";

interface RouteParams {
  params: Promise<{ product_id: string }>;
}

interface ProductUpdate {
  category_id?: string;
  name?: string;
  slug?: string;
  short_description?: string;
  description?: string;
  regular_price?: number;
  sale_price?: number;
  sku?: string;
  stock_quantity?: number;
  is_active?: boolean;
  is_featured?: boolean;
  warranty_months?: number;
  material?: string;
  weight?: number;
  fitment_guide?: string;
  technical_specification?: string[];
  reviews?: string[];
}

export async function GET(_request: Request, context: RouteParams) {
  const authError = await requireAdmin();
  if (authError) return authError;
  try {
    const { product_id } = await context.params;

    const { data, error } = await supabase
      .from("products")
      .select(`
        *,
        categories(category_id, name, slug),
        product_images(image_id, image_url, alt_text, is_primary, display_order),
        product_compatibility(compatibility_id, bike_brand, bike_model, year_from, year_to, notes)
      `)
      .eq("product_id", product_id)
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ product: data });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to fetch product";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, context: RouteParams) {
  const authError = await requireAdmin();
  if (authError) return authError;
  try {
    const { product_id } = await context.params;
    const body = await request.json();

    const {
      category_id, name, slug, short_description, description,
      regular_price, sale_price, sku, stock_quantity, is_active,
      is_featured, warranty_months, material, technical_specification,
      reviews, weight, fitment_guide,
    } = body;

    const updateData: ProductUpdate = {};
    if (category_id !== undefined) updateData.category_id = category_id;
    if (name !== undefined) updateData.name = name;
    if (slug !== undefined) updateData.slug = slug;
    if (short_description !== undefined) updateData.short_description = short_description;
    if (description !== undefined) updateData.description = description;
    if (regular_price !== undefined) updateData.regular_price = regular_price;
    if (sale_price !== undefined) updateData.sale_price = sale_price;
    if (sku !== undefined) updateData.sku = sku;
    if (stock_quantity !== undefined) updateData.stock_quantity = stock_quantity;
    if (is_active !== undefined) updateData.is_active = is_active;
    if (is_featured !== undefined) updateData.is_featured = is_featured;
    if (warranty_months !== undefined) updateData.warranty_months = warranty_months;
    if (material !== undefined) updateData.material = material;
    if (weight !== undefined) updateData.weight = weight;
    if (fitment_guide !== undefined) updateData.fitment_guide = fitment_guide;
    if (technical_specification !== undefined) updateData.technical_specification = technical_specification;
    if (reviews !== undefined) updateData.reviews = reviews;

    const { data, error } = await supabase
      .from("products")
      .update(updateData)
      .eq("product_id", product_id)
      .select(`
        *,
        categories(category_id, name, slug),
        product_images(image_id, image_url, alt_text, is_primary, display_order),
        product_compatibility(compatibility_id, bike_brand, bike_model, year_from, year_to, notes)
      `);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data || data.length === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Product updated successfully", product: data[0] });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Something went wrong";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(_request: Request, context: RouteParams) {
  const authError = await requireAdmin();
  if (authError) return authError;
  try {
    const { product_id } = await context.params;

    const { error } = await supabase
      .from("products")
      .delete()
      .eq("product_id", product_id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Something went wrong";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
