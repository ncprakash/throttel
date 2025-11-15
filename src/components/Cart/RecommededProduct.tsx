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
            className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 hover:scale-105 transition-all duration-300 group cursor-pointer"
            onClick={() => router.push(`/product/${product.slug}`)}
          >
            {/* Product Image */}
            <div className="relative aspect-square backdrop-blur-sm bg-white/5">
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
                    <span className="text-lg font-bold text-green-400">
                      ${product.sale_price.toFixed(2)}
                    </span>
                    <span className="text-sm text-white/40 line-through">
                      ${product.regular_price.toFixed(2)}
                    </span>
                  </>
                ) : (
                  <span className="text-lg font-bold text-white">
                    ${product.regular_price.toFixed(2)}
                  </span>
                )}
              </div>
              
              <button className="w-full backdrop-blur-md bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/30 text-cyan-400 font-semibold py-2 rounded-lg transition-all">
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
