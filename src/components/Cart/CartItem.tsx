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

  const price = item.product.sale_price || item.product.regular_price;
  const variantPrice = item.variant?.additional_price || 0;
  const totalPrice = (price + variantPrice) * quantity;

  const handleQuantityChange = (delta: number) => {
    const newQuantity = Math.max(1, quantity + delta);
    setQuantity(newQuantity);
    onUpdateQuantity(item.cart_item_id, newQuantity);
  };

  const handleRemove = () => {
    setRemoving(true);
    setTimeout(() => onRemove(item.cart_item_id), 300);
  };

  return (
    <div
      className={`backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-6 hover:bg-white/10 transition-all ${
        removing ? "opacity-0 scale-95" : "opacity-100 scale-100"
      }`}
    >
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
        {/* Product Image */}
        <div className="relative w-full sm:w-32 h-32 flex-shrink-0 backdrop-blur-sm bg-white/5 rounded-xl overflow-hidden group">
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
            <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2 hover:text-purple-300 transition-colors cursor-pointer">
              {item.product.name}
            </h3>
            
            {/* Variant Info */}
            {item.variant && (
              <div className="flex items-center gap-2 mb-3">
                <div
                  className="w-5 h-5 rounded border-2 border-white/20"
                  style={{ backgroundColor: item.variant.color }}
                />
                <span className="text-sm text-white/60">
                  {item.variant.variant_name}
                </span>
              </div>
            )}
          </div>

          {/* Bottom Section - Price & Actions */}
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
            {/* Quantity Controls */}
            <div className="flex items-center gap-3">
              <div className="flex items-center backdrop-blur-md bg-white/5 border border-white/10 rounded-lg">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                  className="px-3 py-2 text-white hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                </button>
                <span className="px-4 py-2 text-white font-semibold min-w-[40px] text-center border-x border-white/10">
                  {quantity}
                </span>
                <button
                  onClick={() => handleQuantityChange(1)}
                  className="px-3 py-2 text-white hover:bg-white/10 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
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
                  <div className="text-sm text-white/40 line-through">
                    ${(item.product.regular_price * quantity).toFixed(2)}
                  </div>
                )}
              </div>
              
              {/* Remove Button */}
              <button
                onClick={handleRemove}
                className="p-2 backdrop-blur-md bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-lg transition-all group"
                aria-label="Remove item"
              >
                <svg
                  className="w-5 h-5 text-red-400 group-hover:text-red-300"
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
