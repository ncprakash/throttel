// components/product/ProductVariants.tsx
"use client";

import { useState } from "react";

type Variant = {
  variant_id: string;
  variant_name: string;
  color: string;
  additional_price: number;
  stock_quantity: number;
  is_active: boolean;
};

type ProductVariantsProps = {
  variants: Variant[];
  onVariantSelect: (variant: Variant) => void;
};

export default function ProductVariants({
  variants,
  onVariantSelect,
}: ProductVariantsProps) {
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);

  if (!variants || variants.length === 0) return null;

  const handleSelect = (variant: Variant) => {
    setSelectedVariant(variant.variant_id);
    onVariantSelect(variant);
  };

  return (
    <div className="space-y-3">
      <label className="text-sm font-semibold text-white">Finish</label>
      <div className="flex gap-3 flex-wrap">
        {variants.map((variant) => (
          <button
            key={variant.variant_id}
            onClick={() => handleSelect(variant)}
            disabled={!variant.is_active || variant.stock_quantity === 0}
            className={`relative backdrop-blur-md border rounded-xl p-1 transition-all ${
              selectedVariant === variant.variant_id
                ? "border-white bg-white/10 scale-105"
                : "border-white/20 hover:border-white/40"
            } ${
              !variant.is_active || variant.stock_quantity === 0
                ? "opacity-50 cursor-not-allowed"
                : "cursor-pointer"
            }`}
          >
            <div
              className="w-12 h-12 rounded-lg border-2 border-white/20"
              style={{ backgroundColor: variant.color }}
              title={variant.variant_name}
            />
            {selectedVariant === variant.variant_id && (
              <div className="absolute inset-0 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white drop-shadow-lg"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
