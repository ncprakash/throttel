// components/Checkout/OrderReview.tsx
"use client";

import Image from "next/image";

type Item = {
  cart_item_id: string;
  quantity: number;
  product: {
    product_id: string;
    name: string;
    image_url: string;
    regular_price: number;
    sale_price?: number;
  };
};

export default function OrderReview({ items }: { items: Item[] }) {
  if (!items || items.length === 0) {
    return <div className="text-white/60">No items in cart.</div>;
  }

  return (
    <div className="space-y-4">
      {items.map((it) => {
        const price = it.product.sale_price ?? it.product.regular_price;

        return (
          <div
            key={it.cart_item_id}
            className="
              flex items-center gap-4 p-4 rounded-2xl
              backdrop-blur-lg 
              bg-[rgba(255,255,255,0.03)] 
              border border-[rgba(255,255,255,0.06)]
              shadow-[0_0_20px_rgba(0,0,0,0.25)]
              transition-all
              hover:bg-[rgba(255,255,255,0.05)]
              hover:shadow-[0_0_25px_rgba(0,0,0,0.35)]
            "
          >
            {/* Product Image */}
            <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-[rgba(255,255,255,0.04)]">
              <Image
                src={it.product.image_url}
                alt={it.product.name}
                fill
                className="object-cover"
              />
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="text-sm font-semibold text-white line-clamp-1">
                {it.product.name}
              </div>
              <div className="text-xs text-white/60">
                {it.quantity} × ${price.toFixed(2)}
              </div>
            </div>

            {/* Total */}
            <div className="text-sm font-semibold text-white">
              ${(price * it.quantity).toFixed(2)}
            </div>
          </div>
        );
      })}
    </div>
  );
}
