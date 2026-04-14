// components/admin/OrdersList.tsx
"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

type OrderUser = {
  user_id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  role: string | null;
};

type OrderItem = {
  order_item_id: string;
  product_id: string | null;
  variant_id: string | null;
  product_name: string;
  variant_name: string | null;
  quantity: number;
  unit_price: number;
  total_price: number;
};

type Order = {
  order_id: string;
  order_number: string;
  status: string | null;
  payment_status: string | null;
  payment_method: string | null;
  total_amount: number;
  subtotal: number;
  shipping_charges: number;
  tax_amount: number;
  created_at: string;
  users: OrderUser | null;
  order_items: OrderItem[];
};

export default function OrdersList() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get("/api/admin/orders", {
        params: { limit: 50 },
      });
      const payload: Order[] = res.data.orders ?? res.data ?? [];
      const uniqueOrders = Array.from(
        new Map(payload.map((order) => [order.order_id, order])).values()
      );
      setOrders(uniqueOrders);
    } catch (err) {
      console.error("Failed to load orders", err);
      setError("Failed to load orders");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="glass-panel p-4 rounded-2xl border border-white/10">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-lg">Recent orders</h3>
          <p className="text-xs text-white/50">
            Includes customer and ordered products
          </p>
        </div>
        <button
          onClick={load}
          className="px-3 py-1 rounded-md border border-white/10 text-xs hover:bg-white/10"
        >
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="py-8 text-center text-white/60">Loading...</div>
      ) : error ? (
        <div className="py-8 text-center text-rose-400">{error}</div>
      ) : orders.length === 0 ? (
        <div className="py-8 text-center text-white/60">No orders found</div>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => {
            const customerName = o.users
              ? `${o.users.first_name ?? ""} ${o.users.last_name ?? ""}`.trim() ||
                o.users.email
              : "Guest / unknown";

            return (
              <div
                key={o.order_id}
                className="rounded-2xl bg-[rgba(15,15,15,0.9)] border border-white/10 p-4 md:p-5 shadow-lg flex flex-col gap-3"
              >
                {/* Top row: order meta */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold px-2 py-1 rounded-full bg-white/10">
                        #{o.order_number ?? o.order_id.slice(0, 8)}
                      </span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          o.status === "completed"
                            ? "bg-emerald-500/10 text-emerald-300"
                            : o.status === "cancelled"
                            ? "bg-rose-500/10 text-rose-300"
                            : "bg-amber-500/10 text-amber-300"
                        }`}
                      >
                        {o.status ?? "pending"}
                      </span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          o.payment_status === "paid"
                            ? "bg-emerald-500/10 text-emerald-300"
                            : "bg-amber-500/10 text-amber-300"
                        }`}
                      >
                        {o.payment_status ?? "pending"}
                      </span>
                    </div>
                    <div className="text-xs text-white/60 mt-1">
                      {customerName} •{" "}
                      {o.created_at
                        ? new Date(o.created_at).toLocaleString()
                        : "-"}
                    </div>
                    {o.users?.phone && (
                      <div className="text-xs text-white/40 mt-0.5">
                        {o.users.phone}
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold">
                      ₹{o.total_amount.toFixed(2)}
                    </div>
                    <div className="text-[11px] text-white/60">
                      {o.payment_method || "razorpay"}
                    </div>
                    <div className="text-[11px] text-white/40 mt-1">
                      Subtotal ₹{o.subtotal.toFixed(2)} · Ship ₹
                      {o.shipping_charges.toFixed(2)} · Tax ₹
                      {o.tax_amount.toFixed(2)}
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-white/10" />

                {/* Items list */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-white/70">
                      Items ({o.order_items.length})
                    </span>
                  </div>
                  <div className="space-y-1 max-h-40 overflow-auto pr-1">
                    {o.order_items.map((it) => (
                      <div
                        key={it.order_item_id}
                        className="flex justify-between text-xs text-white/80"
                      >
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {it.product_name}
                          </span>
                          {it.variant_name && (
                            <span className="text-white/50 text-[11px]">
                              {it.variant_name}
                            </span>
                          )}
                          <span className="text-white/40 text-[11px]">
                            Qty {it.quantity} · ₹{it.unit_price.toFixed(2)} each
                          </span>
                        </div>
                        <div className="text-right text-xs font-semibold">
                          ₹{it.total_price.toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
