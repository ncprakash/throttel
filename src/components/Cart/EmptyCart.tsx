// components/cart/EmptyCart.tsx
"use client";

import { useRouter } from "next/navigation";

export default function EmptyCart() {
  const router = useRouter();

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="backdrop-blur-xl bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded-3xl p-12 max-w-2xl w-full text-center">
        {/* Cart Icon */}
        <div className="w-24 h-24 mx-auto mb-6 backdrop-blur-md bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.1)] rounded-full flex items-center justify-center">
          <svg
            className="w-12 h-12 text-[rgba(255,255,255,0.8)]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
        </div>

        {/* Title & Description */}
        <h2 className="text-3xl font-bold text-white mb-3">
          Your Cart is Empty
        </h2>
        <p className="text-[rgba(255,255,255,0.6)] mb-8">
          Looks like you haven't added anything yet. Let’s find something that
          sparks your ride.
        </p>

        {/* CTA Button */}
        <button
          onClick={() => router.push("/shop")}
          className="
            backdrop-blur-md 
            bg-[rgba(255,255,255,0.08)] 
            hover:bg-[rgba(255,255,255,0.12)] 
            text-white font-semibold 
            px-8 py-4 rounded-xl 
            transition-all hover:scale-105 
            shadow-[0_8px_30px_rgba(0,0,0,0.4)]
          "
          aria-label="Continue shopping"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
}
