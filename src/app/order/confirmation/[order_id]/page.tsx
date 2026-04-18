// app/order/confirmation/[order_id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

interface Order {
  order_id: string;
  total_amount: number;
  subtotal?: number;
  shipping_charges?: number;
  tax_amount?: number;
  payment_method: string;
  status: string;
  customer_name?: string;
  customer_email?: string;
  shipping_address?: string;
  shiprocket_order_id?: string | null;
  order_items?: Array<{
    product_name: string;
    quantity: number;
    unit_price: number;
    total_price: number;
    variant_name?: string | null;
  }>;
}

export default function OrderConfirmation() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const orderId = params.order_id as string;

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) {
        router.push("/orders");
        return;
      }

      try {
        const res = await fetch(`/api/orders/${orderId}`, {
          credentials: "include",
        });

        if (res.ok) {
          const orderData = await res.json();
          setOrder(orderData);
        } else {
          setError(`Failed to load order (${res.status})`);
        }
      } catch {
        setError("Network error. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center p-8">
        <div className="backdrop-blur-xl bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded-2xl p-12 text-center max-w-md mx-auto">
          <div className="w-16 h-16 border-4 border-[rgba(255,255,255,0.16)] border-t-white rounded-full animate-spin mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-white mb-2">Order Confirmed!</h2>
          <p className="text-white/70">Loading your order details...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center p-8">
        <div className="backdrop-blur-xl bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded-2xl p-12 text-center max-w-md mx-auto">
          <h1 className="text-3xl font-bold text-white mb-4">Order Not Found</h1>
          <p className="text-white/60 mb-2">
            {error || "The order you're looking for doesn't exist"}
          </p>
          <p className="text-white/40 text-sm mb-8">Order ID: {orderId}</p>
          <button
            onClick={() => router.push("/shop")}
            className="px-8 py-3 rounded-xl bg-white text-black font-semibold hover:bg-white/90 transition"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent text-white py-20 px-4">
      <div className="max-w-4xl mx-auto">

        {/* Success Header */}
        <div className="backdrop-blur-xl bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded-3xl p-12 text-center mb-12">
          <div className="w-28 h-28 bg-green-500/20 border-4 border-green-500/50 rounded-full flex items-center justify-center mx-auto mb-8">
            <svg className="w-16 h-16 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
            Thank You!
          </h1>
          <p className="text-xl md:text-2xl text-white/70 mb-2">Your order has been confirmed</p>
          <p className="text-lg text-white/50">Order #{order.order_id.slice(-8).toUpperCase()}</p>
        </div>

        {/* Order Summary */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">

          {/* Order Details */}
          <div className="backdrop-blur-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.04)] rounded-2xl p-8">
            <h3 className="text-2xl font-bold mb-6">Order Details</h3>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between">
                <span className="text-white/70">Subtotal</span>
                <span>₹{(order.subtotal ?? 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">Shipping</span>
                <span>₹{(order.shipping_charges ?? 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">Tax (18%)</span>
                <span>₹{(order.tax_amount ?? 0).toLocaleString()}</span>
              </div>
              <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent my-4" />
              <div className="flex justify-between text-xl font-bold">
                <span>Total</span>
                <span>₹{order.total_amount.toLocaleString()}</span>
              </div>
            </div>

            {/* Order Items */}
            {order.order_items && order.order_items.length > 0 && (
              <div className="mt-6 pt-6 border-t border-white/10">
                <h4 className="text-sm font-semibold text-white/70 mb-3">Items</h4>
                <div className="space-y-2">
                  {Array.from(
                    new Map(
                      order.order_items.map((item) => [
                        `${item.product_name}-${item.variant_name ?? ""}-${item.unit_price}-${item.total_price}`,
                        item,
                      ])
                    ).values()
                  ).map((item, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span className="text-white/80">
                        {item.product_name} × {item.quantity}
                      </span>
                      <span>₹{item.total_price.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Payment & Status */}
          <div className="backdrop-blur-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.04)] rounded-2xl p-8">
            <h3 className="text-2xl font-bold mb-6">Payment Status</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-[rgba(255,255,255,0.05)] rounded-xl">
                <span className="text-white/70">Payment Method</span>
                <span className="font-semibold">{order.payment_method.toUpperCase()}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-[rgba(255,255,255,0.05)] rounded-xl">
                <span className="text-white/70">Order Status</span>
                <span className="px-4 py-2 bg-green-500/20 text-green-400 rounded-full text-sm font-semibold border border-green-500/30">
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>
              {order.customer_name && (
                <div className="flex items-center justify-between p-4 bg-[rgba(255,255,255,0.05)] rounded-xl">
                  <span className="text-white/70">Customer</span>
                  <span className="font-semibold">{order.customer_name}</span>
                </div>
              )}
              {order.shipping_address && (
                <div className="p-4 bg-[rgba(255,255,255,0.05)] rounded-xl">
                  <span className="text-white/70 text-sm block mb-1">Shipping Address</span>
                  <span className="text-sm">{order.shipping_address}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ShipRocket Tracking */}
        <div className="backdrop-blur-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-2xl p-8 mb-8">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" />
            </svg>
            Shipment Tracking
          </h3>

          {order.shiprocket_order_id ? (
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex-1 p-4 bg-[rgba(255,255,255,0.05)] rounded-xl">
                <p className="text-xs text-white/50 mb-1">ShipRocket Order ID</p>
                <p className="font-mono font-semibold text-white text-lg">{order.shiprocket_order_id}</p>
              </div>
              <a
                href={`https://www.shiprocket.in/shipment-tracking/?id=${order.shiprocket_order_id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-all shadow-lg hover:shadow-blue-500/25 whitespace-nowrap"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Track on ShipRocket
              </a>
            </div>
          ) : (
            <p className="text-white/50 text-sm">
              Tracking details will appear here once your shipment is dispatched. You will also receive a confirmation email.
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => router.push("/orders")}
            className="flex-1 sm:flex-none px-8 py-4 rounded-2xl bg-white text-black font-semibold text-lg hover:bg-white/90 transition-all shadow-xl hover:shadow-2xl"
          >
            Track Orders
          </button>
          <button
            onClick={() => router.push("/shop")}
            className="flex-1 sm:flex-none px-8 py-4 rounded-2xl border-2 border-white/30 text-white font-semibold text-lg hover:bg-white/10 hover:border-white transition-all shadow-xl hover:shadow-2xl"
          >
            Continue Shopping
          </button>
        </div>

      </div>
    </div>
  );
}