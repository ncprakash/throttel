"use client";
import React, { useState } from "react";
import Badge from "./Badge";

type OrderItem = {
  name: string;
  qty: number;
  price: number;
};

type Order = {
  order_number: string;
  created_at?: string;
  status?: string;
  total_amount: number;
  items: OrderItem[];
  shiprocket_order_id?: string | null;
};

type OrderDetailsModalProps = {
  open: boolean;
  order?: Order | null;
  onClose: () => void;
};

export default function OrderDetailsModal({ open, order, onClose }: OrderDetailsModalProps) {
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
              {order.created_at ? new Date(order.created_at).toLocaleString() : "—"}
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
              {(order.items || []).map((it: OrderItem, idx: number) => (
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
                    order.status === "delivered"
                      ? "bg-green-700/15 text-green-200 border border-green-700/10"
                      : "bg-white/6 text-white/80 border border-white/8"
                  }
                `}
              >
                {order.status || "—"}
              </Badge>
            </div>

            {order.shiprocket_order_id && (
              <div className="mt-5 pt-4 border-t border-white/10">
                <p className="text-xs text-white/50 mb-1">ShipRocket ID</p>
                <p className="font-mono text-sm text-white mb-3">{order.shiprocket_order_id}</p>
                <a
                  href={`https://www.shiprocket.in/shipment-tracking/?id=${order.shiprocket_order_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  Track Shipment
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Example usage - mapping backend order to this component's props
/*
const backendOrder = {
  order_number: "ORD-1764262050531-439",
  created_at: "2025-11-27T16:47:31.46924",
  status: "pending",
  total_amount: 353.76,
  order_items: [
      {
          quantity: 1,
          unit_price: 232,
          total_price: 232,
          product_name: "asdasd",
          variant_name: null
      }
  ]
};

const mappedOrder = {
  order_number: backendOrder.order_number,
  created_at: backendOrder.created_at,
  status: backendOrder.status,
  total_amount: backendOrder.total_amount,
  items: backendOrder.order_items.map((item: any) => ({
    name: item.product_name,
    qty: item.quantity,
    price: item.total_price, // or unit_price based on preference
  })),
};

// Render modal passing mappedOrder:
/*
<OrderDetailsModal
  open={isModalOpen}
  order={mappedOrder}
  onClose={closeModalFunction}
/>
*/
