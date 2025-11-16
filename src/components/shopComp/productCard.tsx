// components/shop/ProductGrid.tsx
"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

type Product = {
  id: string;
  name: string;
  slug: string; // Add slug for clean URLs
  image: string;
  price: number;
  originalPrice?: number;
  stock: number;
  compatibility: boolean;
};

type ProductGridProps = {
  products: Product[];
  viewMode: "grid" | "list";
};

export default function ProductGrid({ products, viewMode }: ProductGridProps) {
  const [wishlist, setWishlist] = useState<string[]>([]);

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  return (
    <div
      className={`${
        viewMode === "grid"
          ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          : "flex flex-col gap-4"
      }`}
    >
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          viewMode={viewMode}
          isWishlisted={wishlist.includes(product.id)}
          onToggleWishlist={() => toggleWishlist(product.id)}
        />
      ))}
    </div>
  );
}

function ProductCard({
  product,
  viewMode,
  isWishlisted,
  onToggleWishlist,
}: {
  product: Product;
  viewMode: "grid" | "list";
  isWishlisted: boolean;
  onToggleWishlist: () => void;
}) {
  const router = useRouter();

  // Handle click to navigate to product detail
  const handleProductClick = () => {
    router.push(`/product/${product.slug}`);
  };

  if (viewMode === "list") {
    return (
       <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-4 hover:bg-white/10 hover:border-white/20 transition-all group relative z-0">
        <div className="flex gap-6">
          {/* Image - Clickable */}
          <div
            className="relative w-32 h-32 flex-shrink-0 cursor-pointer"
            onClick={handleProductClick}
          >
            <div className="absolute inset-0 backdrop-blur-sm bg-[rgba(255,255,255,0.03)] rounded-xl overflow-hidden">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-300"
              />
            </div>

            {/* Compatibility Badge */}
            {product.compatibility ? (
              <div className="absolute top-2 left-2 backdrop-blur-md bg-[rgba(34,197,94,0.95)] rounded-lg px-2 py-1 text-[10px] font-semibold text-white flex items-center gap-1">
                <svg
                  className="w-3 h-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Fits
              </div>
            ) : (
              <div className="absolute top-2 left-2 backdrop-blur-md bg-[rgba(239,68,68,0.95)] rounded-lg px-2 py-1 text-[10px] font-semibold text-white flex items-center gap-1">
                <svg
                  className="w-3 h-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                No Fit
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 flex flex-col justify-between">
            <div>
              {/* Product Name - Clickable */}
              <h3
                className="text-lg font-semibold text-white mb-2 group-hover:text-white/90 transition-colors cursor-pointer"
                onClick={handleProductClick}
              >
                {product.name}
              </h3>
            </div>

            <div className="flex items-end justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold text-white">
                    ${product.price.toFixed(2)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm text-[rgba(255,255,255,0.4)] line-through">
                      ${product.originalPrice.toFixed(2)}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1 mt-1">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      product.stock > 5
                        ? "bg-[rgba(34,197,94,1)]"
                        : "bg-[rgba(250,204,21,1)]"
                    }`}
                  />
                  <span className="text-xs text-[rgba(255,255,255,0.7)]">
                    {product.stock > 5
                      ? `In Stock: ${product.stock}+`
                      : `Low Stock: ${product.stock} left`}
                  </span>
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation(); // Prevent navigation when clicking wishlist
                  onToggleWishlist();
                }}
                className="p-2 backdrop-blur-md bg-[rgba(255,255,255,0.06)] hover:bg-[rgba(255,255,255,0.12)] border border-[rgba(255,255,255,0.08)] rounded-lg transition-all"
                aria-label={
                  isWishlisted ? "Remove from wishlist" : "Add to wishlist"
                }
              >
                <svg
                  className={`w-5 h-5 transition-colors ${
                    isWishlisted
                      ? "text-[rgba(239,68,68,1)] fill-current"
                      : "text-[rgba(255,255,255,0.75)]"
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid View (Default)
  return (
    <div className="backdrop-blur-xl bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded-2xl overflow-hidden hover:bg-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.12)] hover:scale-105 transition-all duration-300 group">
      {/* Image Container - Clickable */}
      <div
        className="relative aspect-square backdrop-blur-sm bg-[rgba(255,255,255,0.03)] cursor-pointer"
        onClick={handleProductClick}
      >
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-300"
        />

        {/* Compatibility Badge */}
        {product.compatibility ? (
          <div className="absolute top-3 left-3 backdrop-blur-md bg-[rgba(34,197,94,0.95)] rounded-lg px-3 py-1.5 text-xs font-semibold text-white flex items-center gap-1.5">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            Fits
          </div>
        ) : (
          <div className="absolute top-3 left-3 backdrop-blur-md bg-[rgba(239,68,68,0.95)] rounded-lg px-3 py-1.5 text-xs font-semibold text-white flex items-center gap-1.5">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            No Fit
          </div>
        )}

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation(); // Prevent navigation when clicking wishlist
            onToggleWishlist();
          }}
          className="absolute top-3 right-3 p-2 backdrop-blur-md bg-[rgba(0,0,0,0.4)] hover:bg-[rgba(0,0,0,0.6)] border border-[rgba(255,255,255,0.08)] rounded-lg transition-all opacity-0 group-hover:opacity-100"
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <svg
            className={`w-5 h-5 transition-colors ${
              isWishlisted
                ? "text-[rgba(239,68,68,1)] fill-current"
                : "text-[rgba(255,255,255,1)]"
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </button>
      </div>

      {/* Content - Clickable */}
      <div className="p-5 cursor-pointer" onClick={handleProductClick}>
        <h3 className="text-lg font-semibold text-white mb-3 line-clamp-2 group-hover:text-white/90 transition-colors">
          {product.name}
        </h3>

        {/* Price */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-2xl font-bold text-white">
            ${product.price.toFixed(2)}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-[rgba(255,255,255,0.4)] line-through">
              ${product.originalPrice.toFixed(2)}
            </span>
          )}
        </div>

        {/* Stock Indicator */}
        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${
              product.stock > 5
                ? "bg-[rgba(34,197,94,1)]"
                : "bg-[rgba(250,204,21,1)]"
            }`}
          />
          <span className="text-sm text-[rgba(255,255,255,0.7)]">
            {product.stock > 5
              ? `In Stock: ${product.stock}+`
              : `Low Stock: ${product.stock} left`}
          </span>
        </div>
      </div>
    </div>
  );
}
