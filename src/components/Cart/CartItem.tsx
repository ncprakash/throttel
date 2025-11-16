// components/cart/CartItem.tsx
"use client";

import Image from "next/image";
import { useState } from "react";

type CartItemProps = {
  item: {
    cart_item_id: string;
    product: {
      product_id: string;
      name: string;
      slug: string;
      image_url: string;
      regular_price: number;
      sale_price?: number;
    };
    variant?: {
      variant_id: string;
      variant_name: string;
      color: string;
      additional_price: number;
    };
    quantity: number;
  };
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemove: (itemId: string) => void;
};

export default function CartItem({
  item,
  onUpdateQuantity,
  onRemove,
}: CartItemProps) {
  const [quantity, setQuantity] = useState(item.quantity);
  const [removing, setRemoving] = useState(false);

  const price = item.product.sale_price ?? item.product.regular_price;
  const variantPrice = item.variant?.additional_price || 0;
  const totalPrice = (price + variantPrice) * quantity;

  const handleQuantityChange = (delta: number) => {
    const newQuantity = Math.max(1, quantity + delta);
    setQuantity(newQuantity);
    onUpdateQuantity(item.cart_item_id, newQuantity);
  };

  const handleRemove = () => {
    // use opacity + max-height for a transform-free collapse
    setRemoving(true);
    setTimeout(() => onRemove(item.cart_item_id), 300);
  };

  return (
    <div
      // note: NO transform / scale classes here
      className={`backdrop-blur-xl bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded-2xl p-4 sm:p-6 hover:bg-[rgba(255,255,255,0.08)] transition-all overflow-hidden
        ${removing ? "opacity-0 max-h-0 p-0" : "opacity-100 max-h-[2000px]"}
      `}
      style={{
        transitionProperty: "opacity, max-height, padding",
        transitionDuration: "300ms",
      }}
    >
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
        {/* Product Image */}
        <div className="relative w-full sm:w-32 h-32 flex-shrink-0 backdrop-blur-sm bg-[rgba(255,255,255,0.03)] rounded-xl overflow-hidden group">
          <Image
            src={item.product.image_url}
            alt={item.product.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-300"
          />
        </div>

        {/* Product Info */}
        <div className="flex-1 flex flex-col justify-between">
          {/* Top Section */}
          <div>
            <h3
              className="text-lg font-semibold text-white mb-2 line-clamp-2 hover:text-[rgba(255,255,255,0.9)] transition-colors cursor-pointer"
              title={item.product.name}
            >
              {item.product.name}
            </h3>

            {/* Variant Info */}
            {item.variant && (
              <div className="flex items-center gap-2 mb-3">
                <div
                  className="w-5 h-5 rounded border-2 border-[rgba(255,255,255,0.08)]"
                  style={{ backgroundColor: item.variant.color }}
                />
                <span className="text-sm text-[rgba(255,255,255,0.6)]">
                  {item.variant.variant_name}
                </span>
              </div>
            )}
          </div>

          {/* Bottom Section - Price & Actions */}
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
            {/* Quantity Controls */}
            <div className="flex items-center gap-3">
              <div className="flex items-center backdrop-blur-md bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)] rounded-lg">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                  className="px-3 py-2 text-white hover:bg-[rgba(255,255,255,0.06)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Decrease quantity"
                >
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
                      d="M20 12H4"
                    />
                  </svg>
                </button>

                <span className="px-4 py-2 text-white font-semibold min-w-[40px] text-center border-x border-[rgba(255,255,255,0.06)]">
                  {quantity}
                </span>

                <button
                  onClick={() => handleQuantityChange(1)}
                  className="px-3 py-2 text-white hover:bg-[rgba(255,255,255,0.06)] transition-colors"
                  aria-label="Increase quantity"
                >
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
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Price & Remove */}
            <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
              <div className="text-right">
                <div className="text-2xl font-bold text-white">
                  ${totalPrice.toFixed(2)}
                </div>
                {item.product.sale_price && (
                  <div className="text-sm text-[rgba(255,255,255,0.4)] line-through">
                    ${(item.product.regular_price * quantity).toFixed(2)}
                  </div>
                )}
              </div>

              {/* Remove Button (B/W only) */}
              <button
                onClick={handleRemove}
                className="p-2 backdrop-blur-md bg-[rgba(255,255,255,0.06)] hover:bg-[rgba(255,255,255,0.12)] border border-[rgba(255,255,255,0.08)] rounded-lg transition-all group"
                aria-label="Remove item"
              >
                <svg
                  className="w-5 h-5 text-white group-hover:text-[rgba(255,255,255,0.9)]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
