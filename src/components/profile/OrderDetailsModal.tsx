"use client";
import React from "react";
import Badge from "./Badge";

export default function OrderDetailsModal({
  open,
  order,
  onClose,
}: {
  open: boolean;
  order?: any | null;
  onClose: () => void;
}) {
  if (!open || !order) return null;
  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50"
      role="dialog"
      aria-modal="true"
      aria-label={`Order ${order.order_number} details`}
    >
      <div className="w-full max-w-2xl rounded-2xl p-6 border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.6)]">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-bold text-white">{`Order ${order.order_number}`}</h3>
            <div className="text-xs text-white/60">
              Placed:{" "}
              {order.created_at
                ? new Date(order.created_at).toLocaleString()
                : "—"}
            </div>
          </div>

          <div>
            <button
              className="px-3 py-1 rounded-lg bg-white/10 text-white hover:bg-white/20 transition"
              onClick={onClose}
              aria-label="Close order details"
            >
              Close
            </button>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-semibold text-white/90">Items</h4>
            <ul className="mt-3 space-y-3 text-sm">
              {(order.items || []).map((it: any, idx: number) => (
                <li
                  key={idx}
                  className="flex items-center justify-between bg-white/3 p-3 rounded-lg border border-white/6"
                >
                  <div className="text-sm text-white">
                    {it.name}{" "}
                    <small className="text-xs text-white/60">x{it.qty}</small>
                  </div>
                  <div className="font-medium text-white">₹{it.price}</div>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white/90">Summary</h4>
            <div className="mt-3 text-sm text-white">
              Total: <span className="font-bold">₹{order.total_amount}</span>
            </div>

            <div className="mt-4">
              <Badge
                className={`
                  inline-flex items-center rounded-full px-3 py-1 text-sm
                  ${
                    order.status
                      ? order.status === "delivered"
                        ? "bg-green-700/15 text-green-200 border border-green-700/10"
                        : "bg-white/6 text-white/80 border border-white/8"
                      : "bg-white/6 text-white/80 border border-white/8"
                  }
                `}
              >
                {order.status || "—"}
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
