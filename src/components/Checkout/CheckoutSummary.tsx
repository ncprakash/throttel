"use client";

import { useState, useMemo } from "react";

type Props = {
  subtotal: number;
  itemCount: number;
  onPlaceOrder: (paymentMethod?: string) => void | Promise<void>;
  placingOrder: boolean;
  couponLabel?: string;
  discount?: number;
  total?: number;
  // New — passed from checkout page
  shipping?: number;
  shippingLabel?: string;
  tax?: number;
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
  itemCount,
  onPlaceOrder,
  placingOrder,
  couponLabel,
  discount = 0,
  total: propTotal,
  shipping,
  shippingLabel,
  tax,
}: Props) {
  const [paymentMethod, setPaymentMethod] = useState<"online" | "cod">(
    "online",
  );

  const total = useMemo(() => {
    if (typeof propTotal === "number") return propTotal;
    return Math.max(subtotal - discount, 0);
  }, [subtotal, discount, propTotal]);

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
            <span className="text-green-400">-{formatCurrency(discount)}</span>
          </div>
        )}

        {typeof shipping === "number" && (
          <div className="flex justify-between text-sm">
            <span className="text-white/60">{shippingLabel ?? "Shipping"}</span>
            <span>{formatCurrency(shipping)}</span>
          </div>
        )}

        {typeof tax === "number" && tax > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-white/60">GST (18%)</span>
            <span>{formatCurrency(tax)}</span>
          </div>
        )}

        <div className="border-t border-white/10 pt-3">
          <div className="flex justify-between font-semibold text-lg">
            <span>Total</span>
            <span>{formatCurrency(total)}</span>
          </div>
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
