// components/cart/CartSummary.tsx
"use client";

import { useRouter } from "next/navigation";

type CartSummaryProps = {
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  itemCount: number;
};

export default function CartSummary({
  subtotal,
  shipping,
  tax,
  total,
  itemCount,
}: CartSummaryProps) {
  const router = useRouter();

  return (
    <div className="backdrop-blur-xl bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded-2xl p-6 top-8">
      <h2 className="text-xl font-bold text-white mb-6">Order Summary</h2>

      {/* Order Details */}
      <div className="space-y-3 mb-6">
        <div className="flex justify-between text-sm">
          <span className="text-[rgba(255,255,255,0.6)]">
            Subtotal ({itemCount} items)
          </span>
          <span className="text-white font-semibold">
            ${subtotal.toFixed(2)}
          </span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-[rgba(255,255,255,0.6)]">Shipping</span>
          <span className="text-[rgba(34,197,94,1)] font-semibold">
            {shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}
          </span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-[rgba(255,255,255,0.6)]">Tax (18%)</span>
          <span className="text-white font-semibold">${tax.toFixed(2)}</span>
        </div>

        <div className="border-t border-[rgba(255,255,255,0.06)] pt-3 mt-3">
          <div className="flex justify-between">
            <span className="text-lg font-bold text-white">Total</span>
            <span className="text-2xl font-bold text-white">
              ${total.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Promo Code */}
      <div className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Promo code"
            className="flex-1 backdrop-blur-md bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)] rounded-lg px-4 py-3 text-sm text-white placeholder-[rgba(255,255,255,0.4)] focus:outline-none focus:ring-2 focus:ring-[rgba(255,255,255,0.04)] transition-colors"
          />
          <button
            className="backdrop-blur-md bg-[rgba(255,255,255,0.06)] hover:bg-[rgba(255,255,255,0.10)] border border-[rgba(255,255,255,0.08)] px-4 py-3 rounded-lg text-sm text-white font-semibold transition-all"
            aria-label="Apply promo code"
          >
            Apply
          </button>
        </div>
      </div>

      {/* Checkout Button */}
      <button
        onClick={() => router.push("/checkout")}
        className="w-full backdrop-blur-md bg-[rgba(255,255,255,0.08)] hover:bg-[rgba(255,255,255,0.12)] text-white font-bold py-3 rounded-xl transition-all hover:scale-105 shadow-[0_10px_30px_rgba(0,0,0,0.4)] flex items-center justify-center gap-2"
        aria-label="Proceed to checkout"
      >
        <span>Proceed to Checkout</span>
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M14 5l7 7m0 0l-7 7m7-7H3"
          />
        </svg>
      </button>

      {/* Trust Badges */}
      <div className="mt-6 pt-6 border-t border-[rgba(255,255,255,0.06)]">
        <div className="flex justify-center gap-6 text-xs text-[rgba(255,255,255,0.6)]">
          <div className="flex items-center gap-1">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            <span>Secure</span>
          </div>

          <div className="flex items-center gap-1">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
              />
            </svg>
            <span>Safe Payment</span>
          </div>
        </div>
      </div>
    </div>
  );
}
