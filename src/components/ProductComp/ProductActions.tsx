"use client";

import { useState } from "react";
import { toast } from "sonner";

type ProductActionsProps = {
  maxQuantity: number;
  onAddToCart: (quantity: number) => void;
  onAddToWishlist: () => void;
};

export default function ProductActions({
  maxQuantity,
  onAddToCart,
  onAddToWishlist,
}: ProductActionsProps) {
  const [quantity, setQuantity] = useState(1);

  const handleQuantityChange = (delta: number) => {
    setQuantity((prev) => Math.max(1, Math.min(maxQuantity, prev + delta)));
  };

  return (
    <div className="space-y-4">
      {/* Quantity Selector */}
      <div>
        <label className="text-sm font-semibold text-white mb-2 block">
          Quantity
        </label>

        <div className="flex items-center gap-4">
          <div
            className="flex items-center rounded-xl border"
            style={{
              background: "rgba(255,255,255,0.02)",
              borderColor: "rgba(255,255,255,0.06)",
              backdropFilter: "blur(6px)",
            }}
          >
            <button
              onClick={() => handleQuantityChange(-1)}
              disabled={quantity <= 1}
              className="px-4 py-3 text-white text-xl disabled:opacity-30 flex items-center justify-center"
              aria-label="decrease quantity"
            >
              <span className="leading-none select-none">−</span>
            </button>

            <span className="px-6 py-3 text-lg font-semibold text-white border-x border-[rgba(255,255,255,0.06)] text-center min-w-[56px]">
              {quantity}
            </span>

            <button
              onClick={() => handleQuantityChange(1)}
              disabled={quantity >= maxQuantity}
              className="px-4 py-3 text-white text-xl disabled:opacity-30 flex items-center justify-center"
              aria-label="increase quantity"
            >
              <span className="leading-none select-none">+</span>
            </button>
          </div>

          <span className="text-sm text-[rgba(255,255,255,0.6)]">
            {maxQuantity} available
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        {/* Add to Cart */}
        <button
          onClick={() => {
            try {
              onAddToCart(quantity);
              toast.success("Added to cart");
            } catch (err) {
              toast.error("Could not add to cart");
            }
          }}
          className="w-full py-3 rounded-xl font-semibold text-white border flex items-center justify-center gap-3"
          style={{
            background: "rgba(255,255,255,0.05)",
            borderColor: "rgba(255,255,255,0.08)",
            backdropFilter: "blur(6px)",
            transition: "opacity 120ms ease, transform 120ms ease",
          }}
        >
          <svg
            className="w-5 h-5 flex-shrink-0"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            aria-hidden
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 
              0a2 2 0 100 4 2 2 0 000-4zm-8 
              2a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <span className="leading-none">Add to Cart</span>
        </button>

        {/* Add to Wishlist */}
        <button
          onClick={() => {
            try {
              onAddToWishlist();
              toast.success("Added to wishlist");
            } catch (err) {
              toast.error("Could not add to wishlist");
            }
          }}
          className="w-full py-3 rounded-xl font-semibold text-white border flex items-center justify-center gap-3"
          style={{
            background: "rgba(255,255,255,0.03)",
            borderColor: "rgba(255,255,255,0.08)",
            backdropFilter: "blur(6px)",
            transition: "opacity 120ms ease, transform 120ms ease",
          }}
        >
          <svg
            className="w-5 h-5 flex-shrink-0"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            aria-hidden
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 
              20.364l7.682-7.682a4.5 4.5 
              0 00-6.364-6.364L12 
              7.636l-1.318-1.318a4.5 4.5 
              0 00-6.364 0z"
            />
          </svg>
          <span className="leading-none">Add to Wishlist</span>
        </button>
      </div>
    </div>
  );
}
