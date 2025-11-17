// components/Checkout/CheckoutSummary.tsx
"use client";

import { useState } from "react";

type Props = {
  subtotal: number;
  shipping: number;
  total: number;
  itemCount: number;
  shippingMethod: "standard" | "express";
  onChangeShipping: (method: "standard" | "express") => void;
  onPlaceOrder: (paymentMethod: string) => void;
  placingOrder: boolean;
};

export default function CheckoutSummary({
  subtotal,
  shipping,
  total,
  itemCount,
  shippingMethod,
  onChangeShipping,
  onPlaceOrder,
  placingOrder,
}: Props) {
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "online">("cod");

  return (
    <div className="backdrop-blur-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.04)] rounded-2xl p-6">
      <h3 className="text-lg font-semibold mb-4">Order Summary</h3>

      <div className="space-y-3 mb-6">
        <div className="flex justify-between text-sm">
          <span className="text-white/60">Subtotal ({itemCount} items)</span>
          <span>₹{subtotal.toFixed(2)}</span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-white/60">Shipping</span>
          <span>₹{shipping.toFixed(2)}</span>
        </div>

        <div className="border-t border-white/10 pt-3">
          <div className="flex justify-between font-semibold text-lg">
            <span>Total</span>
            <span>₹{total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Shipping Method */}
      <div className="mb-6">
        <label className="text-sm text-white/60 mb-2 block">Shipping Method</label>
        <div className="space-y-2">
          <label className="flex items-center gap-3 p-3 rounded-lg bg-white/5 cursor-pointer hover:bg-white/10 transition">
            <input
              type="radio"
              name="shipping"
              checked={shippingMethod === "standard"}
              onChange={() => onChangeShipping("standard")}
            />
            <div className="flex-1">
              <div className="font-medium">Standard Shipping</div>
              <div className="text-xs text-white/60">5-7 business days</div>
            </div>
            <span className="text-sm">₹80</span>
          </label>

          <label className="flex items-center gap-3 p-3 rounded-lg bg-white/5 cursor-pointer hover:bg-white/10 transition">
            <input
              type="radio"
              name="shipping"
              checked={shippingMethod === "express"}
              onChange={() => onChangeShipping("express")}
            />
            <div className="flex-1">
              <div className="font-medium">Express Shipping</div>
              <div className="text-xs text-white/60">2-3 business days</div>
            </div>
            <span className="text-sm">₹80</span>
          </label>
        </div>
      </div>

      {/* Payment Method */}
      <div className="mb-6">
        <label className="text-sm text-white/60 mb-2 block">Payment Method</label>
        <div className="space-y-2">
          <label className="flex items-center gap-3 p-3 rounded-lg bg-white/5 cursor-pointer hover:bg-white/10 transition">
            <input
              type="radio"
              name="payment"
              checked={paymentMethod === "cod"}
              onChange={() => setPaymentMethod("cod")}
            />
            <span>Cash on Delivery</span>
          </label>

          <label className="flex items-center gap-3 p-3 rounded-lg bg-white/5 cursor-pointer hover:bg-white/10 transition">
            <input
              type="radio"
              name="payment"
              checked={paymentMethod === "online"}
              onChange={() => setPaymentMethod("online")}
            />
            <span>Online Payment</span>
          </label>
        </div>
      </div>

      {/* Place Order Button */}
      <button
        onClick={() => onPlaceOrder(paymentMethod)}
        disabled={placingOrder}
        className="w-full px-6 py-3 rounded-lg bg-white text-black font-semibold hover:bg-white/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {placingOrder ? "Placing Order..." : "Place Order"}
      </button>

      <p className="text-xs text-white/40 mt-3 text-center">
        By placing your order, you agree to our terms and conditions
      </p>
    </div>
  );
}
