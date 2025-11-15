// app/checkout/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

import CheckoutForm from "@/components/Checkout/CheckoutForm";
import PaymentMethods from "@/components/Checkout/PaymentMethods";
import CheckoutSummary from "@/components/Checkout/CheckoutSummary";
import OrderReview from "@/components/Checkout/OrderReview";

export default function CheckoutPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [shippingMethod, setShippingMethod] = useState<"standard" | "express">(
    "standard"
  );

  useEffect(() => {
    // fetch cart items (UI-only). No backend changes required — replace if you have a different endpoint.
    const load = async () => {
      try {
        const res = await axios.get("/api/cart");
        setCartItems(res.data.items || []);
      } catch (e) {
        console.error("Failed to load cart for checkout", e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const subtotal = cartItems.reduce((s, it) => {
    const price = it.product?.sale_price ?? it.product?.regular_price ?? 0;
    const variant = it.variant?.additional_price || 0;
    return s + (price + variant) * it.quantity;
  }, 0);

  const shipping = shippingMethod === "express" ? 20 : subtotal > 50 ? 0 : 10;
  const tax = subtotal * 0.18;
  const total = subtotal + shipping + tax;

  const handlePlaceOrder = async (formValues: any, paymentMethod: string) => {
    // UI-only: simulate order placement
    console.log("Place order", { formValues, paymentMethod, cartItems, total });
    // Ideally POST to /api/orders -> returns order id, then redirect to /order/confirmation/[id]
    router.push("/order/confirmation"); // placeholder route
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="backdrop-blur-xl bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded-2xl p-8">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-[rgba(255,255,255,0.16)] border-t-white rounded-full animate-spin" />
            <p className="text-white">Preparing checkout...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pb-32">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold">Checkout</h1>
          <p className="text-[rgba(255,255,255,0.6)] mt-1">
            Secure checkout — review & place your order
          </p>
        </div>

        <div className="grid lg:grid-cols-[1fr_420px] gap-8 items-start">
          <div className="space-y-6">
            <div className="backdrop-blur-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.04)] rounded-2xl p-6">
              <h2 className="text-lg font-semibold mb-4">Shipping & Contact</h2>
              <CheckoutForm />
            </div>

            <div className="backdrop-blur-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.04)] rounded-2xl p-6">
              <h2 className="text-lg font-semibold mb-4">Payment</h2>
              <PaymentMethods
                onPlaceOrder={handlePlaceOrder}
                cartTotal={total}
              />
            </div>
          </div>

          <div className="space-y-6">
            <CheckoutSummary
              subtotal={subtotal}
              shipping={shipping}
              tax={tax}
              total={total}
              itemCount={cartItems.length}
              onChangeShipping={(m) => setShippingMethod(m)}
              shippingMethod={shippingMethod}
            />

            <div className="backdrop-blur-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.04)] rounded-2xl p-6">
              <h3 className="text-lg font-semibold mb-4">Order review</h3>
              <OrderReview items={cartItems} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
