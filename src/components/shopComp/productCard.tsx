// components/shop/ProductGrid.tsx
"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaCheck, FaTimes, FaHeart, FaRegHeart, FaShoppingCart } from "react-icons/fa";

type Product = {
  id: string;
  name: string;
  slug: string;
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

  const toggleWishlist = (id: string) => {
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div 
      className={
        viewMode === "grid" 
          ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" 
          : "flex flex-col gap-4"
      }
      role="list"
      aria-label="Product list"
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

// Helper Components - Defined OUTSIDE ProductCard to prevent re-creation on each render

const Badge = ({ fits }: { fits: boolean }) => (
  <div 
    className={`backdrop-blur-md rounded-lg px-3 py-1.5 text-xs font-bold text-white flex items-center gap-1.5 shadow-lg transition-all ${
      fits 
        ? "bg-emerald-500/90 hover:bg-emerald-500" 
        : "bg-rose-500/90 hover:bg-rose-500"
    }`}
    role="status"
    aria-label={fits ? "Compatible with your bike" : "Not compatible with your bike"}
  >
    {fits ? <FaCheck className="w-3 h-3" /> : <FaTimes className="w-3 h-3" />}
    {fits ? "Compatible" : "Not Compatible"}
  </div>
);

const WishlistBtn = ({ 
  isWishlisted, 
  onClick 
}: { 
  isWishlisted: boolean; 
  onClick: (e: React.MouseEvent) => void;
}) => (
  <button
    onClick={onClick}
    className="p-2.5 backdrop-blur-md bg-black/50 hover:bg-black/70 border border-white/20 rounded-xl transition-all hover:scale-110 active:scale-95"
    aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
  >
    {isWishlisted ? (
      <FaHeart className="w-5 h-5 text-rose-500 drop-shadow-lg" />
    ) : (
      <FaRegHeart className="w-5 h-5 text-white" />
    )}
  </button>
);

const StockIndicator = ({ stock }: { stock: number }) => {
  const isLowStock = stock <= 5;
  const isOutOfStock = stock === 0;
  
  return (
    <div className="flex items-center gap-2">
      <div 
        className={`w-2.5 h-2.5 rounded-full shadow-lg ${
          isOutOfStock 
            ? "bg-gray-400 animate-pulse" 
            : isLowStock 
            ? "bg-amber-400 animate-pulse" 
            : "bg-emerald-400"
        }`}
        aria-hidden="true"
      />
      <span className={`text-sm font-medium ${
        isOutOfStock 
          ? "text-gray-400" 
          : isLowStock 
          ? "text-amber-400" 
          : "text-emerald-400"
      }`}>
        {isOutOfStock 
          ? "Out of Stock" 
          : isLowStock 
          ? `Only ${stock} left!` 
          : `In Stock (${stock}+)`}
      </span>
    </div>
  );
};

const Price = ({ 
  price, 
  originalPrice 
}: { 
  price: number; 
  originalPrice?: number;
}) => {
  const discountPercent = originalPrice 
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  return (
    <div className="flex items-baseline gap-2 flex-wrap">
      <span className="text-2xl font-bold text-white">
        ${price.toFixed(2)}
      </span>
      {originalPrice && (
        <>
          <span className="text-base text-white/40 line-through">
            ${originalPrice.toFixed(2)}
          </span>
          <span className="text-xs font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full">
            Save {discountPercent}%
          </span>
        </>
      )}
    </div>
  );
};

const AddToCartBtn = ({ 
  stock, 
  onClick 
}: { 
  stock: number; 
  onClick: (e: React.MouseEvent) => void;
}) => (
  <button
    onClick={onClick}
    disabled={stock === 0}
    className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition-all ${
      stock === 0
        ? "bg-gray-600/50 text-gray-400 cursor-not-allowed"
        : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-lg hover:shadow-purple-500/50 hover:scale-105 active:scale-95"
    }`}
    aria-label={stock === 0 ? "Out of stock" : "Add to cart"}
  >
    <FaShoppingCart className="w-4 h-4" />
    {stock === 0 ? "Out of Stock" : "Add to Cart"}
  </button>
);

// Main ProductCard Component
function ProductCard({ 
  product, 
  viewMode, 
  isWishlisted, 
  onToggleWishlist 
}: {
  product: Product;
  viewMode: "grid" | "list";
  isWishlisted: boolean;
  onToggleWishlist: () => void;
}) {
  const router = useRouter();
  const [imageLoaded, setImageLoaded] = useState(false);
  
  const discountPercent = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleWishlist();
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Add to cart logic here
    console.log("Added to cart:", product.id);
  };

  const navigateToProduct = () => {
    router.push(`/product/${product.slug}`);
  };

  if (viewMode === "list") {
    return (
      <article 
        className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 hover:border-white/20 hover:shadow-2xl hover:shadow-purple-500/10 transition-all group relative"
        role="listitem"
      >
        <div className="flex gap-6 flex-col sm:flex-row">
          {/* Image */}
          <div 
            className="relative w-full sm:w-40 h-40 shrink-0 cursor-pointer" 
            onClick={navigateToProduct}
          >
            <div className="absolute inset-0 backdrop-blur-sm bg-white/5 rounded-xl overflow-hidden">
              {!imageLoaded && (
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 animate-pulse" />
              )}
              <Image 
                src={product.image} 
                alt={product.name} 
                fill 
                className={`object-cover group-hover:scale-110 transition-transform duration-500 ${
                  imageLoaded ? "opacity-100" : "opacity-0"
                }`}
                onLoad={() => setImageLoaded(true)}
                sizes="(max-width: 640px) 100vw, 160px"
              />
            </div>
            
            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-2">
              <Badge fits={product.compatibility} />
              {discountPercent > 0 && (
                <div className="backdrop-blur-md bg-rose-500/90 rounded-lg px-3 py-1.5 text-xs font-bold text-white shadow-lg">
                  -{discountPercent}%
                </div>
              )}
            </div>
            
            <div className="absolute top-3 right-3">
              <WishlistBtn isWishlisted={isWishlisted} onClick={handleWishlistClick} />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 flex flex-col justify-between gap-3">
            <div>
              <h3 
                className="text-xl font-bold text-white mb-2 cursor-pointer hover:text-purple-300 transition-colors line-clamp-2" 
                onClick={navigateToProduct}
              >
                {product.name}
              </h3>
              <StockIndicator stock={product.stock} />
            </div>
            
            <div className="flex items-end justify-between gap-4 flex-wrap">
              <Price price={product.price} originalPrice={product.originalPrice} />
              <AddToCartBtn stock={product.stock} onClick={handleAddToCart} />
            </div>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article 
      className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 hover:border-white/20 hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-300 group relative"
      role="listitem"
    >
      {/* Image Container */}
      <div 
        className="relative aspect-square backdrop-blur-sm bg-white/5 cursor-pointer overflow-hidden" 
        onClick={navigateToProduct}
      >
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 animate-pulse" />
        )}
        <Image 
          src={product.image} 
          alt={product.name} 
          fill 
          className={`object-cover group-hover:scale-110 transition-transform duration-500 ${
            imageLoaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setImageLoaded(true)}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          priority={false}
        />
        
        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          <Badge fits={product.compatibility} />
          {discountPercent > 0 && (
            <div className="backdrop-blur-md bg-rose-500/90 rounded-lg px-3 py-1.5 text-xs font-bold text-white shadow-lg">
              -{discountPercent}% OFF
            </div>
          )}
        </div>
        
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <WishlistBtn isWishlisted={isWishlisted} onClick={handleWishlistClick} />
        </div>

        {/* Quick View Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigateToProduct();
            }}
            className="backdrop-blur-md bg-white/20 hover:bg-white/30 border border-white/30 px-6 py-2.5 rounded-xl text-white font-semibold transition-all hover:scale-105"
          >
            Quick View
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-5 space-y-3">
        <h3 
          className="text-lg font-bold text-white line-clamp-2 cursor-pointer hover:text-purple-300 transition-colors min-h-[3.5rem]" 
          onClick={navigateToProduct}
        >
          {product.name}
        </h3>
        
        <Price price={product.price} originalPrice={product.originalPrice} />
        <StockIndicator stock={product.stock} />
        
        <div className="pt-2">
          <AddToCartBtn stock={product.stock} onClick={handleAddToCart} />
        </div>
      </div>
    </article>
  );
}
