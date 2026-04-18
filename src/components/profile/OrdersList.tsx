"use client";
import React from "react";

export type Order = {
  order_id: string;
  order_number?: string;
  created_at?: string | number;
  status?: string;
  total_amount?: number;
  shiprocket_order_id?: string | null;
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
              className="p-3 rounded-lg bg-white/4 border border-white/10 hover:bg-white/10 hover:border-white/20 transition"
            >
              <div
                role="button"
                tabIndex={0}
                className="flex items-center justify-between cursor-pointer"
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
                  <span className="text-sm text-white/70">{o.status ?? "—"}</span>
                  <div className="font-medium text-white">
                    {typeof o.total_amount === "number"
                      ? new Intl.NumberFormat(undefined, {
                          style: "currency",
                          currency: "INR",
                          maximumFractionDigits: 0,
                        }).format(o.total_amount)
                      : (o.total_amount ?? "—")}
                  </div>
                </div>
              </div>

              {/* ShipRocket tracking */}
              {o.shiprocket_order_id && (
                <div className="mt-2 pt-2 border-t border-white/10 flex items-center justify-between gap-2">
                  <span className="text-xs text-white/50 font-mono">
                    Tracking ID: {o.shiprocket_order_id}
                  </span>
                  <a
                    href={`https://www.shiprocket.in/shipment-tracking/?id=${o.shiprocket_order_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-1 text-xs px-3 py-1 rounded-full bg-blue-600/20 text-blue-400 border border-blue-500/30 hover:bg-blue-600/40 transition whitespace-nowrap"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    Track Order
                  </a>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
