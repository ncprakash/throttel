import { NextRequest, NextResponse } from 'next/server';
import {supabase} from "@/lib/supabase"


export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    // Await params before accessing slug
    const { slug } = await params;

    // Fetch product with all related data using joins
    const { data: product, error } = await supabase
      .from('products')
      .select(`
        *,
        category:categories(category_id, name, slug),
        images:product_images(image_id, image_url, alt_text, display_order, is_primary),
        variants:product_variants(variant_id, variant_name, color, size, sku, additional_price, stock_quantity, is_active),
        compatibility:product_compatibility(compatibility_id, bike_model, bike_brand, year_from, year_to, notes)
      `)
      .eq('slug', slug)
      .eq('is_active', true)
      .single();

    if (error || !product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Sort images by display_order and set primary image first
    if (product.images) {
      product.images.sort((a: any, b: any) => {
        if (a.is_primary) return -1;
        if (b.is_primary) return 1;
        return a.display_order - b.display_order;
      });
    }

    // Filter active variants only
    if (product.variants) {
      product.variants = product.variants.filter((v: any) => v.is_active);
    }

    // Get compatibility info (fit_for field for your frontend)
    if (product.compatibility && product.compatibility.length > 0) {
      product.fit_for = product.compatibility[0].bike_model;
      product.brand = product.compatibility[0].bike_brand;
    }

    return NextResponse.json(product, { status: 200 });

  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
