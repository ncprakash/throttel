// components/Checkout/CheckoutSummary.tsx
"use client";

import { useState, useMemo } from "react";

type Props = {
  subtotal: number;
  shipping: number;
  itemCount: number;
  onPlaceOrder: (paymentMethod: string) => void | Promise<void>;
  placingOrder: boolean;
  couponLabel?: string;
  discount?: number;
};

const formatCurrency = (value: number) =>
  typeof Intl !== "undefined"
    ? new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
      }).format(value)
    : `₹${value.toFixed(2)}`;

export default function CheckoutSummary({
  subtotal,
  shipping,
  itemCount,
  onPlaceOrder,
  placingOrder,
  couponLabel,
  discount = 0,
}: Props) {
  const [paymentMethod, setPaymentMethod] = useState<"online" | "cod">(
    "online"
  );

  // ✔ LOCAL TOTAL CALCULATION
  const total = useMemo(() => {
    return Math.max(subtotal - discount + shipping, 0);
  }, [subtotal, discount, shipping]);

  return (
    <div className="backdrop-blur-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.04)] rounded-2xl p-6">
      <h3 className="text-lg font-semibold mb-4">Order Summary</h3>

      <div className="space-y-3 mb-6">
        <div className="flex justify-between text-sm">
          <span className="text-white/60">Subtotal ({itemCount} items)</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>

        {discount > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-white/60">{couponLabel ?? "Discount"}</span>
            <span>-{formatCurrency(discount)}</span>
          </div>
        )}

        <div className="flex justify-between text-sm">
          <span className="text-white/60">Shipping</span>
          <span>{formatCurrency(shipping)}</span>
        </div>

        <div className="border-t border-white/10 pt-3">
          <div className="flex justify-between font-semibold text-lg">
            <span>Total</span>
            <span>{formatCurrency(total)}</span>
          </div>
        </div>
      </div>

      {/* Standard Shipping */}
      <div className="mb-6">
        <label className="text-sm text-white/60 mb-2 block">
          Shipping Method
        </label>
        <div className="p-3 rounded-lg bg-white/5 flex justify-between items-center">
          <div>
            <div className="font-medium">Standard Shipping</div>
            <div className="text-xs text-white/60">5–7 business days</div>
          </div>
          <span className="text-sm">{formatCurrency(shipping)}</span>
        </div>
      </div>

      {/* Payment Method */}
      <div className="mb-6">
        <label className="text-sm text-white/60 mb-2 block">
          Payment Method
        </label>
        <div className="space-y-2">
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
