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
    <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 sticky top-8">
      <h2 className="text-xl font-bold text-white mb-6">Order Summary</h2>

      {/* Order Details */}
      <div className="space-y-3 mb-6">
        <div className="flex justify-between text-sm">
          <span className="text-white/60">Subtotal ({itemCount} items)</span>
          <span className="text-white font-semibold">${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-white/60">Shipping</span>
          <span className="text-green-400 font-semibold">
            {shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-white/60">Tax (18%)</span>
          <span className="text-white font-semibold">${tax.toFixed(2)}</span>
        </div>
        
        <div className="border-t border-white/10 pt-3 mt-3">
          <div className="flex justify-between">
            <span className="text-lg font-bold text-white">Total</span>
            <span className="text-2xl font-bold text-white">${total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Promo Code */}
      <div className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Promo code"
            className="flex-1 backdrop-blur-md bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-white/40 focus:outline-none focus:border-white/30 transition-colors"
          />
          <button className="backdrop-blur-md bg-white/10 hover:bg-white/15 border border-white/20 px-4 py-3 rounded-lg text-sm text-white font-semibold transition-all">
            Apply
          </button>
        </div>
      </div>

      {/* Checkout Button */}
      <button
        onClick={() => router.push("/checkout")}
        className="w-full backdrop-blur-xl bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-4 rounded-xl transition-all hover:scale-105 shadow-lg shadow-cyan-500/30 flex items-center justify-center gap-2"
      >
        <span>Proceed to Checkout</span>
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      </button>

      {/* Trust Badges */}
      <div className="mt-6 pt-6 border-t border-white/10">
        <div className="flex justify-center gap-6 text-xs text-white/60">
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span>Secure</span>
          </div>
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
            <span>Safe Payment</span>
          </div>
        </div>
      </div>
    </div>
  );
}
