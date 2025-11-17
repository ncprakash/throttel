// app/api/admin/products/[productId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// GET - Fetch single product
export async function GET(
  request: NextRequest,
  { params }: { params: { product_id: string } }
) {
  try {
    const { product_id } = params;


    const { data, error } = await supabase
      .from("products")
      .select(`
        *,
        categories(category_id, name, slug),
        product_images(image_id, image_url, alt_text, is_primary, display_order),
        product_variants(variant_id, variant_name, color, size, sku, additional_price, stock_quantity, is_active),
        product_compatibility(compatibility_id, bike_model, bike_brand, year_from, year_to, notes)
      `)
      .eq("product_id", product_id)
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }

    return NextResponse.json({ product: data });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch product" },
      { status: 500 }
    );
  }
}

// PATCH - Update product
export async function PATCH(
  request: NextRequest,
  { params }: { params: { productId: string } }
) {
  try {
    const { productId } = params;
    const body = await request.json();
    

    const { data, error } = await supabase
      .from("products")
      .update({
        category_id: body.category_id,
        name: body.name,
        slug: body.slug,
        description: body.description,
        short_description: body.short_description,
        regular_price: body.regular_price,
        sale_price: body.sale_price,
        sku: body.sku,
        stock_quantity: body.stock_quantity,
        is_active: body.is_active,
        is_featured: body.is_featured,
        weight: body.weight,
        warranty_months: body.warranty_months,
        warranty_description: body.warranty_description,
        fitment_guide: body.fitment_guide,
        material: body.material,
        updated_at: new Date().toISOString(),
      })
      .eq("product_id", productId)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ product: data });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to update product" },
      { status: 500 }
    );
  }
}

// DELETE - Delete product
export async function DELETE(
  request: NextRequest,
  { params }: { params: { productId: string } }
) {
  try {
    const { productId } = params;
   

    const { error } = await supabase
      .from("products")
      .delete()
      .eq("product_id", productId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to delete product" },
      { status: 500 }
    );
  }
}
