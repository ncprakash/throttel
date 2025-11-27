// app/order/confirmation/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

export default function OrderConfirmation() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const orderId = params.id as string;

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/orders/${orderId}`);
        if (res.ok) {
          const orderData = await res.json();
          setOrder(orderData);
        } else {
          toast.error("Order not found");
          router.push("/orders");
        }
      } catch (error) {
        toast.error("Failed to load order");
        router.push("/orders");
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrder();
    }
  }, [orderId, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center">
        <div className="backdrop-blur-xl bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded-2xl p-8">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-[rgba(255,255,255,0.16)] border-t-white rounded-full animate-spin" />
            <p className="text-white">Loading order details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-2xl font-bold mb-4">Order Not Found</h1>
          <button 
            onClick={() => router.push("/orders")}
            className="px-6 py-3 rounded-lg bg-white text-black font-semibold hover:bg-white/90 transition"
          >
            View Orders
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent text-white py-20">
      <div className="max-w-4xl mx-auto px-4">
        <div className="backdrop-blur-xl bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded-3xl p-12 text-center">
          <div className="w-24 h-24 bg-green-500/20 border-4 border-green-500/50 rounded-full flex items-center justify-center mx-auto mb-8">
            <svg className="w-12 h-12 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h1 className="text-4xl font-bold mb-4">Order Confirmed!</h1>
          <p className="text-xl text-white/70 mb-8">Thank you for your purchase</p>
          
          <div className="bg-[rgba(255,255,255,0.05)] border border-white/10 rounded-2xl p-8 mb-8">
            <h3 className="text-lg font-semibold mb-4">Order #{order.order_id?.slice(-8)}</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div><span className="text-white/70">Total:</span> ₹{order.total_amount}</div>
              <div><span className="text-white/70">Payment:</span> {order.payment_method?.toUpperCase()}</div>
              <div><span className="text-white/70">Status:</span> <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">Confirmed</span></div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push("/orders")}
              className="px-8 py-3 rounded-xl bg-white text-black font-semibold hover:bg-white/90 transition"
            >
              View Orders
            </button>
            <button
              onClick={() => router.push("/shop")}
              className="px-8 py-3 rounded-xl border border-white/30 text-white font-semibold hover:bg-white/10 transition"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
