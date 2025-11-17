// components/WishlistCard.tsx
"use client";
import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Card from "./Card";

export type WishlistItem = {
  wishlist_id: string;
  user_id: string;
  product_id: string;
  created_at: string;
  products: {

    product_id: string;
   
    name: string;
    description: string;
    regular_price: number;
    sale_price: number;
    stock_quantity: number;
    product_images: Array<{
      image_url: string;
      alt_text: string;
      is_primary: boolean;
    }>;
  };
};

type WishlistCardProps = {
  items: WishlistItem[];
  onRemove: (id: string) => void | Promise<void>;
  compact?: boolean;
};

export default function WishlistCard({
  items,
  onRemove,
  compact = false,
}: WishlistCardProps) {
  const router = useRouter();

  const handleRemove = async (id: string) => {
    try {
      await onRemove(id);
    } catch (err) {
      console.error("Failed to remove wishlist item", err);
    }
  };

  const handleView = (slug: string) => {
    router.push(`/product/${slug}`);
  };

  // ✅ Ensure items is always an array
  const safeItems = Array.isArray(items) ? items : [];

  return (
    <Card className="border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_0_20px_rgba(255,255,255,0.05)]">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-white/90">Wishlist</h3>
        <small className="text-xs text-white/60">{safeItems.length} items</small>
      </div>

      {safeItems.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-xs text-white/60">No items in wishlist</p>
        </div>
      ) : (
        <ul className={`space-y-3 ${compact ? "text-sm max-h-96 overflow-y-auto" : ""}`}>
          {safeItems.map((item) => {
            const product = item.products;
            const primaryImage = product?.product_images?.find((img) => img.is_primary);
            const price = product?.sale_price || product?.regular_price || 0;
            const inStock = (product?.stock_quantity || 0) > 0;

            return (
              <li
                key={item.wishlist_id}
                className="
                  flex items-center gap-3 
                  p-3 rounded-lg
                  bg-white/4 border border-white/10 
                  hover:bg-white/10 hover:border-white/20
                  transition
                "
              >
                {/* Product Image */}
                <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-white/10">
                  {primaryImage?.image_url ? (
                    <Image
                      src={primaryImage.image_url}
                      alt={primaryImage.alt_text || product?.name || "Product"}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/40 text-xs">
                      No image
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-white truncate">
                    {product?.name || "Unknown Product"}
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm font-semibold text-white">
                      ₹{price.toFixed(2)}
                    </span>
                    {inStock ? (
                      <span className="text-xs text-green-400">In Stock</span>
                    ) : (
                      <span className="text-xs text-red-400">Out of Stock</span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    className="
                      text-xs text-white/70 hover:text-white 
                      transition underline-offset-2 hover:underline
                      px-2 py-1
                    "
                    aria-label={`View ${product?.name}`}
                    onClick={() => handleView(product?.name)}
                  >
                    View
                  </button>

                  <button
                    className="
                      text-xs text-red-300/70 hover:text-red-300 
                      transition underline-offset-2 hover:underline
                      px-2 py-1
                    "
                    aria-label={`Remove ${product?.name} from wishlist`}
                    onClick={() => void handleRemove(item.wishlist_id)}
                  >
                    Remove
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}
