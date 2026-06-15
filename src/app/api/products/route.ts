// app/api/products/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

interface ProductRow {
  product_id: string;
  name: string;
  slug: string;
  short_description: string | null;
  regular_price: number;
  sale_price: number | null;
  stock_quantity: number;
  is_featured: boolean;
  product_images: { image_url: string; alt_text: string; is_primary: boolean }[];
}

interface CompatibilityRow {
  product_id: string;
  bike_model: string;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryName = searchParams.get("category");

    let categoryId: string | null = null;
    if (categoryName) {
      const { data: catData } = await supabase
        .from("categories")
        .select("category_id")
        .ilike("name", categoryName)
        .single();
      categoryId = catData?.category_id ?? null;
      // If the category doesn't exist, return empty immediately
      if (!categoryId) {
        return NextResponse.json({ success: true, products: [], count: 0 });
      }
    }

    const limit = Math.min(parseInt(searchParams.get("limit") ?? "50"), 100);
    const offset = parseInt(searchParams.get("offset") ?? "0");

    let query = supabase
      .from("products")
      .select(`
        product_id,
        name,
        slug,
        short_description,
        regular_price,
        sale_price,
        stock_quantity,
        is_active,
        is_featured,
        product_images (
          image_url,
          alt_text,
          is_primary
        )
      `)
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (categoryId) query = query.eq("category_id", categoryId);

    const { data: productsData, error: productsError } = await query;

    if (productsError) {
      return NextResponse.json({ error: productsError.message }, { status: 500 });
    }

    const productIds = (productsData as ProductRow[])?.map((p) => p.product_id) || [];

    const [{ data: compatibilityData }] = await Promise.all([
      supabase
        .from("product_compatibility")
        .select("product_id, bike_model")
        .in("product_id", productIds),
    ]);

    const formattedProducts = (productsData as ProductRow[])?.map((product) => {
      const primaryImage =
        product.product_images?.find((img) => img.is_primary) ||
        product.product_images?.[0];

      const compatibleBikes = (compatibilityData as CompatibilityRow[])
        ?.filter((c) => c.product_id === product.product_id)
        .map((c) => c.bike_model) || [];

      return {
        id: product.product_id,
        name: product.name,
        slug: product.slug,
        description: product.short_description || "",
        price: product.sale_price || product.regular_price,
        originalPrice: product.sale_price ? product.regular_price : null,
        stock: product.stock_quantity,
        image: primaryImage?.image_url || "/placeholder.jpg",
        compatibility: compatibleBikes.length > 0,
        compatibleWith: compatibleBikes,
        isFeatured: product.is_featured,
      };
    });

    return NextResponse.json(
      { success: true, products: formattedProducts || [], count: formattedProducts?.length || 0 },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to fetch products";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
