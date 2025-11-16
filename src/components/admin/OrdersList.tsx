// components/admin/OrdersList.tsx
"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

type Order = {
  order_id: string;
  order_number?: string;
  customer_name?: string;
  total_amount?: number;
  status?: string;
  created_at?: string;
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
      setOrders(res.data.orders || res.data || []);
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
        <h3 className="font-semibold">Recent orders</h3>
        <button onClick={load} className="px-3 py-1 rounded-md">
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
        <div className="space-y-3">
          {orders.map((o) => (
            <div
              key={o.order_id}
              className="p-3 rounded-md bg-white/3 border border-white/6 flex items-center justify-between"
            >
              <div>
                <div className="font-medium">
                  {o.order_number ?? `#${o.order_id.slice(0, 8)}`}
                </div>
                <div className="text-xs text-white/60">
                  {o.customer_name} •{" "}
                  {o.created_at ? new Date(o.created_at).toLocaleString() : "-"}
                </div>
              </div>
              <div className="text-right">
                <div className="font-medium">
                  {o.total_amount ? `$${o.total_amount.toFixed(2)}` : "-"}
                </div>
                <div className="text-xs text-white/60">
                  {o.status ?? "pending"}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
