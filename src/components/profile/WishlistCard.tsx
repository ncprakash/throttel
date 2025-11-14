// components/WishlistCard.tsx
"use client";
import React from "react";
import Card from "./Card";

export type WishlistItem = {
  wishlist_id: string;
  product_name: string;
  // add more fields from your API as needed (price, thumbnail, etc.)
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
      // don't let exceptions bubble out of the click handler
      // you can wire a global toast/notice instead of console
      console.error("Failed to remove wishlist item", err);
    }
  };

  return (
    <Card>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold">Wishlist</h3>
        <small className="text-xs text-white/60">{items.length}</small>
      </div>

      {items.length === 0 ? (
        <p className="text-xs text-white/60">No items</p>
      ) : (
        <ul className={`space-y-2 ${compact ? "text-sm" : ""}`}>
          {items.map((w) => (
            <li
              key={w.wishlist_id}
              className="flex items-center justify-between"
            >
              <div className="truncate text-sm">{w.product_name}</div>

              <div className="flex items-center gap-2">
                <button
                  className="text-xs"
                  aria-label={`View ${w.product_name}`}
                  onClick={() => {
                    /* implement navigation / modal open in parent */
                  }}
                >
                  View
                </button>

                <button
                  className="text-xs"
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
