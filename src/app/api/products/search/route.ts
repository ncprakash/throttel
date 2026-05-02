// app/api/products/search/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  const bikeModel = request.nextUrl.searchParams.get("bikeModel");

  if (!bikeModel) {
    return NextResponse.json({ error: "Bike model is required" }, { status: 400 });
  }

  const cleanedBikeModel = bikeModel.trim().replace(/\s+/g, " ");

  try {
    const { data: compatData, error: compatError } = await supabase
      .from("product_compatibility")
      .select("product_id, bike_model, bike_brand, year_from, year_to, notes")
      .ilike("bike_model", `%${cleanedBikeModel}%`);

    if (compatError) {
      return NextResponse.json({ error: compatError.message }, { status: 500 });
    }

    if (!compatData || compatData.length === 0) {
      return NextResponse.json({
        success: true,
        products: [],
        count: 0,
        message: `No products found for "${cleanedBikeModel}"`,
      });
    }

    const productIds = compatData.map((c) => c.product_id);

    const { data: productsData, error: productsError } = await supabase
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
        product_images (
          image_url,
          alt_text,
          is_primary
        )
      `)
      .in("product_id", productIds)
      .eq("is_active", true);

    if (productsError) {
      return NextResponse.json({ error: productsError.message }, { status: 500 });
    }

    const formattedProducts = productsData?.map((product) => {
      const compatibility = compatData.find((c) => c.product_id === product.product_id);
      const primaryImage =
        product.product_images?.find((img: { is_primary: boolean }) => img.is_primary) ||
        product.product_images?.[0];

      return {
        id: product.product_id,
        name: product.name,
        slug: product.slug,
        description: product.short_description || "",
        price: product.sale_price || product.regular_price,
        originalPrice: product.sale_price ? product.regular_price : null,
        stock: product.stock_quantity,
        image: primaryImage?.image_url || "/placeholder.jpg",
        compatibility: true,
        compatibleWith: [compatibility?.bike_model],
        bikeInfo: {
          model: compatibility?.bike_model,
          brand: compatibility?.bike_brand,
          yearRange: `${compatibility?.year_from}-${compatibility?.year_to}`,
          notes: compatibility?.notes || "",
        },
      };
    });

    return NextResponse.json(
      { success: true, products: formattedProducts || [], count: formattedProducts?.length || 0, searchedModel: cleanedBikeModel },
      { headers: { "Cache-Control": "public, max-age=60, stale-while-revalidate=300" } }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Search failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
