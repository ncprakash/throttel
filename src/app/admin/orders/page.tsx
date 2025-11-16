// app/admin/orders/page.tsx
"use client";

import OrdersList from "@/components/admin/OrdersList";

export default function AdminOrdersPage() {
  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Orders</h1>
          <p className="text-sm text-white/60 mt-1">
            View recent orders, update statuses and export.
          </p>
        </div>
      </div>

      <div className="mt-6">
        <OrdersList />
      </div>
    </div>
  );
}
