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
      <div className="min-h-screen bg-black flex items-center justify-center p-8">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-8">
            <div className="absolute inset-0 border border-green-500/15 rounded-full animate-ping" />
            <div className="absolute inset-0 border border-green-500/25 rounded-full" />
            <div className="absolute inset-2 border border-transparent border-t-white/30 rounded-full animate-spin" />
          </div>
          <p className="text-[10px] tracking-[0.4em] text-white/30 uppercase">
            Loading order
          </p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-8">
        <div className="backdrop-blur-xl bg-white/[0.04] border border-white/8 rounded-3xl p-12 text-center max-w-md mx-auto">
          <div className="text-[6rem] font-black text-white/5 mb-6 select-none leading-none">
            404
          </div>
          <h1 className="text-2xl font-bold text-white mb-3">
            Order Not Found
          </h1>
          <p className="text-sm text-white/50 mb-2">
            {error || "The order you're looking for doesn't exist"}
          </p>
          <p className="text-xs text-white/30 mb-8 font-mono">#{orderId}</p>
          <button
            onClick={() => router.push("/shop")}
            className="px-8 py-3.5 rounded-xl bg-white text-black text-sm font-bold hover:bg-white/90 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white py-16 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-16">
          {/* Pulsing ring checkmark */}
          <div className="relative inline-flex items-center justify-center mb-10">
            <div className="absolute w-40 h-40 rounded-full border border-green-500/10 animate-ping" />
            <div className="absolute w-32 h-32 rounded-full border border-green-500/15" />
            <div className="absolute w-24 h-24 rounded-full border border-green-500/20" />
            <div className="w-16 h-16 bg-green-500/10 border-2 border-green-500/40 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>

          <p className="text-[10px] tracking-[0.5em] text-white/30 uppercase mb-4">
            Payment confirmed
          </p>
          <h1 className="text-6xl sm:text-8xl font-black tracking-[-0.04em] leading-none uppercase mb-4">
            Thank
            <br />
            <span className="text-white/30">You!</span>
          </h1>
          <p className="text-white/50 text-lg mb-2">
            Your order has been confirmed
          </p>
          <p className="font-mono text-sm text-white/30">
            #{order.order_id.slice(-8).toUpperCase()}
          </p>
        </div>

        {/* Order Summary */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Order Details */}
          <div className="border border-white/8 rounded-2xl p-8 bg-white/[0.02]">
            <p className="text-[10px] tracking-[0.3em] text-white/30 uppercase mb-6">
              Order details
            </p>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between">
                <span className="text-white/50">Subtotal</span>
                <span className="font-medium">
                  ₹{(order.subtotal ?? 0).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">Shipping</span>
                <span className="font-medium">
                  ₹{(order.shipping_charges ?? 0).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">Tax (18%)</span>
                <span className="font-medium">
                  ₹{(order.tax_amount ?? 0).toLocaleString()}
                </span>
              </div>
              <div className="h-px bg-white/5 my-2" />
              <div className="flex justify-between">
                <span className="font-bold text-base">Total</span>
                <span className="font-black text-xl">
                  ₹{order.total_amount.toLocaleString()}
                </span>
              </div>
            </div>

            {order.order_items && order.order_items.length > 0 && (
              <div className="mt-8 pt-6 border-t border-white/5">
                <p className="text-[10px] tracking-[0.3em] text-white/30 uppercase mb-4">
                  Items
                </p>
                <div className="space-y-3">
                  {Array.from(
                    new Map(
                      order.order_items.map((item) => [
                        `${item.product_name}-${item.variant_name ?? ""}-${item.unit_price}-${item.total_price}`,
                        item,
                      ])
                    ).values()
                  ).map((item, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span className="text-white/70">
                        {item.product_name}{" "}
                        <span className="text-white/30">×{item.quantity}</span>
                      </span>
                      <span className="font-medium">
                        ₹{item.total_price.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Payment & Status */}
          <div className="border border-white/8 rounded-2xl p-8 bg-white/[0.02]">
            <p className="text-[10px] tracking-[0.3em] text-white/30 uppercase mb-6">
              Payment status
            </p>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-white/[0.03] rounded-xl border border-white/5">
                <span className="text-sm text-white/50">Method</span>
                <span className="text-sm font-bold tracking-wider">
                  {order.payment_method.toUpperCase()}
                </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-white/[0.03] rounded-xl border border-white/5">
                <span className="text-sm text-white/50">Status</span>
                <span className="px-3 py-1 bg-green-500/15 text-green-400 rounded-full text-xs font-bold border border-green-500/25">
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>
              {order.customer_name && (
                <div className="flex items-center justify-between p-4 bg-white/[0.03] rounded-xl border border-white/5">
                  <span className="text-sm text-white/50">Customer</span>
                  <span className="text-sm font-medium">
                    {order.customer_name}
                  </span>
                </div>
              )}
              {order.shipping_address && (
                <div className="p-4 bg-white/[0.03] rounded-xl border border-white/5">
                  <p className="text-xs text-white/30 mb-2">Shipping address</p>
                  <p className="text-sm text-white/70">{order.shipping_address}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ShipRocket Tracking */}
        <div className="border border-white/8 rounded-2xl p-8 bg-white/[0.02] mb-8">
          <div className="flex items-center gap-3 mb-6">
            <svg
              className="w-4 h-4 text-white/40"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10"
              />
            </svg>
            <p className="text-[10px] tracking-[0.3em] text-white/30 uppercase">
              Shipment tracking
            </p>
          </div>

          {order.shiprocket_order_id ? (
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex-1 p-4 bg-white/[0.03] rounded-xl border border-white/5">
                <p className="text-xs text-white/30 mb-1">
                  ShipRocket Order ID
                </p>
                <p className="font-mono font-bold text-white">
                  {order.shiprocket_order_id}
                </p>
              </div>
              <a
                href={`https://www.shiprocket.in/shipment-tracking/?id=${order.shiprocket_order_id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white text-black text-sm font-bold hover:bg-white/90 transition-colors whitespace-nowrap"
              >
                Track Shipment
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
            </div>
          ) : (
            <p className="text-sm text-white/40">
              Tracking details will appear here once your shipment is
              dispatched. You will also receive a confirmation email.
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => router.push("/orders")}
            className="flex-1 sm:flex-none px-10 py-4 rounded-xl bg-white text-black text-sm font-bold hover:bg-white/90 transition-colors"
          >
            Track Orders
          </button>
          <button
            onClick={() => router.push("/shop")}
            className="flex-1 sm:flex-none px-10 py-4 rounded-xl border border-white/15 text-sm font-semibold hover:bg-white/5 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}
