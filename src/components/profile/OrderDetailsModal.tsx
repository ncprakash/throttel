"use client";
import React from "react";


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
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-2xl bg-white/3 rounded-2xl p-6">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-bold">Order {order.order_number}</h3>
            <div className="text-xs text-white/60">
              Placed:{" "}
              {order.created_at
                ? new Date(order.created_at).toLocaleString()
                : "—"}
            </div>
          </div>
          <div>
            <button className="px-3 py-1 rounded bg-white/10" onClick={onClose}>
              Close
            </button>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm font-semibold">Items</h4>
            <ul className="mt-2 space-y-2 text-sm">
              {(order.items || []).map((it: any, idx: number) => (
                <li key={idx} className="flex items-center justify-between">
                  <div>
                    {it.name}{" "}
                    <small className="text-xs text-white/60">x{it.qty}</small>
                  </div>
                  <div className="font-medium">₹{it.price}</div>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold">Summary</h4>
            <div className="mt-2 text-sm">
              Total: <span className="font-bold">₹{order.total_amount}</span>
            </div>
            <div className="mt-2">
              <Badge
                className={`${
                  order.status
                    ? order.status === "delivered"
                      ? "bg-green-700/15 text-green-200"
                      : "bg-white/6 text-white/80"
                    : ""
                } px-3`}
              >
                {order.status}
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
