// components/WishlistCard.tsx
"use client";
import React from "react";
import Card from "./Card";

export type WishlistItem = {
  wishlist_id: string;
  product_name: string;
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
  const handleRemove = async (id: string) => {
    try {
      await onRemove(id);
    } catch (err) {
      console.error("Failed to remove wishlist item", err);
    }
  };

  return (
    <Card className="border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_0_20px_rgba(255,255,255,0.05)]">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-white/90">Wishlist</h3>
        <small className="text-xs text-white/60">{items.length}</small>
      </div>

      {items.length === 0 ? (
        <p className="text-xs text-white/60">No items</p>
      ) : (
        <ul className={`space-y-3 ${compact ? "text-sm" : ""}`}>
          {items.map((w) => (
            <li
              key={w.wishlist_id}
              className="
                flex items-center justify-between 
                p-3 rounded-lg
                bg-white/4 border border-white/10 
                hover:bg-white/10 hover:border-white/20
                transition cursor-pointer
              "
            >
              <div className="truncate text-sm text-white">
                {w.product_name}
              </div>

              <div className="flex items-center gap-3">
                <button
                  className="
                    text-xs text-white/70 hover:text-white 
                    transition underline-offset-2 hover:underline
                  "
                  aria-label={`View ${w.product_name}`}
                  onClick={() => {}}
                >
                  View
                </button>

                <button
                  className="
                    text-xs text-red-300/70 hover:text-red-300 
                    transition underline-offset-2 hover:underline
                  "
                  aria-label={`Remove ${w.product_name} from wishlist`}
                  onClick={() => void handleRemove(w.wishlist_id)}
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
