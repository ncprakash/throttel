// components/Checkout/CheckoutSummary.tsx
"use client";

type Props = {
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  itemCount: number;
  shippingMethod: "standard" | "express";
  onChangeShipping: (m: "standard" | "express") => void;
};

export default function CheckoutSummary({
  subtotal,
  shipping,
  tax,
  total,
  itemCount,
  shippingMethod,
  onChangeShipping,
}: Props) {
  return (
    <div
      className="
        relative 
        rounded-2xl 
        p-6 
        backdrop-blur-xl 
        bg-[rgba(255,255,255,0.03)] 
        border border-[rgba(255,255,255,0.06)]
        shadow-[0_0_40px_rgba(0,0,0,0.25)]
        transition-all
        hover:bg-[rgba(255,255,255,0.05)]
        hover:shadow-[0_0_50px_rgba(0,0,0,0.35)]
      "
    >
      {/* subtle glossy reflection */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-b from-white/5 to-transparent opacity-[0.10]" />

      <h3 className="text-lg font-semibold mb-4 relative z-10">Summary</h3>

      <div className="space-y-3 mb-4 text-sm relative z-10">
        <div className="flex justify-between">
          <span className="text-white/70">Subtotal ({itemCount} items)</span>
          <span className="font-semibold text-white">
            ${subtotal.toFixed(2)}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-white/70">Shipping</span>
          <span className="font-semibold text-white">
            {shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-white/70">Tax</span>
          <span className="font-semibold text-white">${tax.toFixed(2)}</span>
        </div>
      </div>

      <div className="border-t border-white/10 pt-4 mb-4 relative z-10">
        <div className="flex justify-between items-center">
          <span className="text-lg font-bold">Total</span>
          <span className="text-2xl font-bold">${total.toFixed(2)}</span>
        </div>
      </div>

      <div className="space-y-4 relative z-10">
        <label className="flex items-center justify-between gap-3 cursor-pointer">
          <div className="flex items-center gap-3">
            <input
              type="radio"
              name="ship"
              checked={shippingMethod === "standard"}
              onChange={() => onChangeShipping("standard")}
              className="accent-white"
            />
            <div>
              <div className="font-semibold">Standard</div>
              <div className="text-sm text-white/60">3–7 business days</div>
            </div>
          </div>
          <div className="text-sm text-white">
            {subtotal > 50 ? "FREE" : "$10"}
          </div>
        </label>

        <label className="flex items-center justify-between gap-3 cursor-pointer">
          <div className="flex items-center gap-3">
            <input
              type="radio"
              name="ship"
              checked={shippingMethod === "express"}
              onChange={() => onChangeShipping("express")}
              className="accent-white"
            />
            <div>
              <div className="font-semibold">Express</div>
              <div className="text-sm text-white/60">1–2 business days</div>
            </div>
          </div>
          <div className="text-sm text-white">$20</div>
        </label>
      </div>
    </div>
  );
}
