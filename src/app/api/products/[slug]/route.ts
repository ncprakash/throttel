import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

type MaybePromiseParams<T> = T | Promise<T>;

export async function GET(
  request: NextRequest,
  context: { params: MaybePromiseParams<{ slug: string }> }
) {
  try {
    const params = (context.params && typeof (context.params as any).then === 'function')
      ? await (context.params as Promise<{ slug: string }>)
      : (context.params as { slug: string });

    const { slug } = params;
    if (!slug) return NextResponse.json({ error: 'Missing slug' }, { status: 400 });

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

    if (error || !product) return NextResponse.json({ error: 'Product not found' }, { status: 404 });

    if (Array.isArray(product.images)) {
      product.images.sort((a: any, b: any) => {
        if (a.is_primary && !b.is_primary) return -1;
        if (!a.is_primary && b.is_primary) return 1;
        return (a.display_order ?? 0) - (b.display_order ?? 0);
      });
    }

    if (Array.isArray(product.variants)) {
      product.variants = product.variants.filter((v: any) => v.is_active);
    }

    if (Array.isArray(product.compatibility) && product.compatibility.length > 0) {
      product.fit_for = product.compatibility[0].bike_model ?? null;
      product.brand = product.compatibility[0].bike_brand ?? null;
    }

    return NextResponse.json(product, { status: 200 });
  } catch (err) {
    console.error('Error fetching product by slug:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
