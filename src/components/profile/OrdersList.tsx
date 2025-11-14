// components/OrdersList.tsx
"use client";
import React from "react";
import Badge from "./Badge";

export type Order = {
  order_id: string;
  order_number?: string;
  created_at?: string | number;
  status?: string;
  total_amount?: number;
  // extend with other fields from your API as needed
};

type OrdersListProps = {
  orders: Order[];
  /**
   * Called when a user opens / clicks an order.
   * The parameter is optional so parent handlers like `() => {}` are accepted.
   */
  onOpen?: (o?: Order) => void;
  compact?: boolean;
};

export default function OrdersList({
  orders,
  onOpen = () => {},
  compact = false,
}: OrdersListProps) {
  const itemsToShow = compact ? orders.slice(0, 4) : orders.slice(0, 6);

  const dateFormatter = new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="bg-white/5 p-4 rounded-lg">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold">Recent orders</h3>
        <button
          type="button"
          className="text-xs text-white/60 hover:underline"
          onClick={() => {
            /* navigate to orders page - implement in parent if needed */
          }}
          aria-label="View all orders"
        >
          View all
        </button>
      </div>

      {orders.length === 0 ? (
        <p className="text-xs text-white/60">No orders yet.</p>
      ) : (
        <ul className="space-y-2">
          {itemsToShow.map((o) => (
            <li
              key={o.order_id}
              role="button"
              tabIndex={0}
              className="flex items-center justify-between p-3 rounded bg-white/5 hover:scale-[1.01] transition-transform cursor-pointer"
              onClick={() => onOpen(o)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  onOpen(o);
                }
              }}
              aria-label={`Open order ${o.order_number || o.order_id}`}
            >
              <div>
                <div className="font-medium">
                  {o.order_number || o.order_id}
                </div>
                <div className="text-xs text-white/60">
                  {o.created_at
                    ? dateFormatter.format(new Date(o.created_at))
                    : ""}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Badge
                  className={`${
                    o.status
                      ? o.status === "delivered"
                        ? "bg-green-700/15 text-green-200"
                        : "bg-white/6 text-white/80"
                      : ""
                  } px-3`}
                >
                  {o.status ?? "—"}
                </Badge>

                <div className="font-medium">
                  {typeof o.total_amount === "number"
                    ? new Intl.NumberFormat(undefined, {
                        style: "currency",
                        currency: "INR",
                        maximumFractionDigits: 0,
                      }).format(o.total_amount)
                    : o.total_amount ?? "—"}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
