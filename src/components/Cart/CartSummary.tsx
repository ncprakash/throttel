"use client";

type CartSummaryProps = {
  subtotal: number;
  itemCount: number;
  shipping?: number;
  shippingLabel?: string;
  tax?: number;
  couponLabel?: string;
  discount?: number;
  total?: number;
};

const formatCurrency = (value: number) =>
  typeof Intl !== "undefined"
    ? new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
      }).format(value)
    : `₹${value.toFixed(2)}`;

export default function CartSummary({
  subtotal,
  itemCount,
  shipping,
  shippingLabel,
  tax,
  couponLabel,
  discount = 0,
  total: propTotal,
}: CartSummaryProps) {
  const total =
    typeof propTotal === "number"
      ? propTotal
      : Math.max(subtotal - discount, 0);

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Order Summary</h3>

      <div className="space-y-3">
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
    </div>
  );
}
