// components/cart/RecommendedProducts.tsx
"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

type Product = {
  product_id: string;
  name: string;
  slug: string;
  image_url: string;
  regular_price: number;
  sale_price?: number;
};

type RecommendedProductsProps = {
  products: Product[];
};

export default function RecommendedProducts({
  products,
}: RecommendedProductsProps) {
  const router = useRouter();

  if (!products || products.length === 0) return null;

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold text-white mb-6">Revisit Your Finds</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div
            key={product.product_id}
            className="
              backdrop-blur-xl bg-[rgba(255,255,255,0.04)]
              border border-[rgba(255,255,255,0.08)]
              rounded-2xl overflow-hidden
              hover:bg-[rgba(255,255,255,0.08)]
              hover:scale-105 transition-all duration-300
              group cursor-pointer
            "
            onClick={() => router.push(`/product/${product.slug}`)}
          >
            {/* Product Image */}
            <div className="relative aspect-square backdrop-blur-sm bg-[rgba(255,255,255,0.03)]">
              <Image
                src={product.image_url}
                alt={product.name}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-300"
              />
            </div>

            {/* Product Info */}
            <div className="p-4">
              <h3 className="text-white font-semibold mb-2 line-clamp-2">
                {product.name}
              </h3>

              <div className="flex items-center gap-2 mb-3">
                {product.sale_price ? (
                  <>
                    <span className="text-lg font-bold text-[rgba(34,197,94,1)]">
                      ${product.sale_price.toFixed(2)}
                    </span>
                    <span className="text-sm text-[rgba(255,255,255,0.4)] line-through">
                      ${product.regular_price.toFixed(2)}
                    </span>
                  </>
                ) : (
                  <span className="text-lg font-bold text-white">
                    ${product.regular_price.toFixed(2)}
                  </span>
                )}
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  // Add-to-cart logic goes here (UI-only)
                }}
                className="
                  w-full
                  backdrop-blur-md 
                  bg-[rgba(255,255,255,0.06)]
                  hover:bg-[rgba(255,255,255,0.12)]
                  border border-[rgba(255,255,255,0.08)]
                  text-white font-semibold 
                  py-2 rounded-lg transition-all
                "
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
