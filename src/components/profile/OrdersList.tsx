"use client";
import React from "react";
import Badge from "./Badge";

export type Order = {
  order_id: string;
  order_number?: string;
  created_at?: string | number;
  status?: string;
  total_amount?: number;
};

type OrdersListProps = {
  orders: Order[];
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
    <div className="p-4 rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_0_20px_rgba(255,255,255,0.05)]">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-white/90">Recent orders</h3>

        <button
          type="button"
          className="text-xs text-white/60 hover:text-white hover:underline transition"
          aria-label="View all orders"
          onClick={() => {}}
        >
          View all
        </button>
      </div>

      {orders.length === 0 ? (
        <p className="text-xs text-white/60">No orders yet.</p>
      ) : (
        <ul className="space-y-3">
          {itemsToShow.map((o) => (
            <li
              key={o.order_id}
              role="button"
              tabIndex={0}
              className="
                flex items-center justify-between 
                p-3 rounded-lg
                bg-white/4 border border-white/10 
                hover:bg-white/10 hover:border-white/20 
                transition cursor-pointer
                hover:scale-[1.01]
              "
              onClick={() => onOpen(o)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") onOpen(o);
              }}
            >
              <div>
                <div className="font-medium text-white">
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
                  className={`
                    inline-flex items-center rounded-full px-3 py-1 text-xs
                    ${
                      o.status
                        ? o.status === "delivered"
                          ? "bg-green-700/15 text-green-200 border border-green-700/10"
                          : "bg-white/6 text-white/80 border border-white/10"
                        : "bg-white/6 text-white/80 border border-white/10"
                    }
                  `}
                >
                  {o.status ?? "—"}
                </Badge>

                <div className="font-medium text-white">
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
