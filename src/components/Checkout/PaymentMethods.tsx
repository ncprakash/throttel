// components/Checkout/PaymentMethods.tsx
"use client";

import { useState } from "react";

type Props = {
  cartTotal: number;
  onPlaceOrder: (formValues: any, paymentMethod: string) => void;
};

export default function PaymentMethods({ cartTotal, onPlaceOrder }: Props) {
  const [method, setMethod] = useState<"card" | "upi" | "cod">("card");
  const [card, setCard] = useState({ number: "", name: "", exp: "", cvv: "" });
  const [upi, setUpi] = useState("");

  const mockForm = {
    card: card,
    upi,
  };

  const OptionCard: React.FC<
    React.PropsWithChildren<{
      active?: boolean;
      onClick?: () => void;
      ariaLabel?: string;
    }>
  > = ({ children, active = false, onClick, ariaLabel }) => (
    <div
      role="button"
      aria-label={ariaLabel}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onClick?.();
      }}
      onClick={onClick}
      className={`
        relative cursor-pointer rounded-xl p-4 flex items-start gap-3
        backdrop-blur-md bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.04)]
        transition-all focus:outline-none focus:ring-2 focus:ring-white/20
        ${
          active
            ? "shadow-[0_8px_30px_rgba(0,0,0,0.35)] bg-[rgba(255,255,255,0.04)]"
            : "hover:bg-[rgba(255,255,255,0.03)]"
        }
      `}
    >
      {/* subtle sheen */}
      <span className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-b from-white/3 to-transparent mix-blend-overlay opacity-10" />
      {children}
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <OptionCard
          active={method === "card"}
          onClick={() => setMethod("card")}
          ariaLabel="Pay with card"
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                method === "card"
                  ? "bg-white text-black border-white/60"
                  : "border-[rgba(255,255,255,0.08)]"
              }`}
              aria-hidden
            >
              {method === "card" ? (
                <svg
                  className="w-3 h-3"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 12h14"
                  />
                </svg>
              ) : (
                <div className="w-3 h-3 rounded-full" />
              )}
            </div>
          </div>

          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-white">Card</div>
                <div className="text-sm text-[rgba(255,255,255,0.6)]">
                  Enter card details at next step
                </div>
              </div>
              <input
                type="radio"
                name="pm"
                checked={method === "card"}
                onChange={() => setMethod("card")}
                className="sr-only"
                aria-label="Select card payment"
              />
            </div>

            {/* Card fields (UI-only) */}
            {method === "card" && (
              <div className="mt-3 grid grid-cols-2 gap-2">
                <input
                  aria-label="Card number"
                  value={card.number}
                  onChange={(e) =>
                    setCard((c) => ({ ...c, number: e.target.value }))
                  }
                  placeholder="Card number"
                  className="col-span-2 backdrop-blur-sm bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.04)] rounded-lg px-3 py-2 text-sm text-white placeholder-white/40 focus:outline-none"
                />
                <input
                  aria-label="Card name"
                  value={card.name}
                  onChange={(e) =>
                    setCard((c) => ({ ...c, name: e.target.value }))
                  }
                  placeholder="Name on card"
                  className="backdrop-blur-sm bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.04)] rounded-lg px-3 py-2 text-sm text-white placeholder-white/40 focus:outline-none"
                />
                <input
                  aria-label="Expiry"
                  value={card.exp}
                  onChange={(e) =>
                    setCard((c) => ({ ...c, exp: e.target.value }))
                  }
                  placeholder="MM/YY"
                  className="backdrop-blur-sm bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.04)] rounded-lg px-3 py-2 text-sm text-white placeholder-white/40 focus:outline-none"
                />
                <input
                  aria-label="CVV"
                  value={card.cvv}
                  onChange={(e) =>
                    setCard((c) => ({ ...c, cvv: e.target.value }))
                  }
                  placeholder="CVV"
                  className="backdrop-blur-sm bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.04)] rounded-lg px-3 py-2 text-sm text-white placeholder-white/40 focus:outline-none"
                />
              </div>
            )}
          </div>
        </OptionCard>

        <OptionCard
          active={method === "upi"}
          onClick={() => setMethod("upi")}
          ariaLabel="Pay with UPI"
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                method === "upi"
                  ? "bg-white text-black border-white/60"
                  : "border-[rgba(255,255,255,0.08)]"
              }`}
              aria-hidden
            >
              {method === "upi" ? (
                <svg
                  className="w-3 h-3"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 5v14M5 12h14"
                  />
                </svg>
              ) : (
                <div className="w-3 h-3 rounded-full" />
              )}
            </div>
          </div>

          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-white">UPI / Wallet</div>
                <div className="text-sm text-[rgba(255,255,255,0.6)]">
                  Pay using your UPI app
                </div>
              </div>
              <input
                type="radio"
                name="pm"
                checked={method === "upi"}
                onChange={() => setMethod("upi")}
                className="sr-only"
                aria-label="Select UPI payment"
              />
            </div>

            {method === "upi" && (
              <div className="mt-3">
                <input
                  aria-label="UPI ID"
                  value={upi}
                  onChange={(e) => setUpi(e.target.value)}
                  placeholder="yourupi@bank or phone@upi"
                  className="w-full backdrop-blur-sm bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.04)] rounded-lg px-3 py-2 text-sm text-white placeholder-white/40 focus:outline-none"
                />
              </div>
            )}
          </div>
        </OptionCard>

        <OptionCard
          active={method === "cod"}
          onClick={() => setMethod("cod")}
          ariaLabel="Cash on delivery"
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                method === "cod"
                  ? "bg-white text-black border-white/60"
                  : "border-[rgba(255,255,255,0.08)]"
              }`}
              aria-hidden
            >
              {method === "cod" ? (
                <svg
                  className="w-3 h-3"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 10h18M7 15h1m4 0h1"
                  />
                </svg>
              ) : (
                <div className="w-3 h-3 rounded-full" />
              )}
            </div>
          </div>

          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-white">Cash on Delivery</div>
                <div className="text-sm text-[rgba(255,255,255,0.6)]">
                  Pay when the parcel arrives
                </div>
              </div>
              <input
                type="radio"
                name="pm"
                checked={method === "cod"}
                onChange={() => setMethod("cod")}
                className="sr-only"
                aria-label="Select cash on delivery"
              />
            </div>
          </div>
        </OptionCard>
      </div>

      <div className="pt-4 border-t border-[rgba(255,255,255,0.04)] relative">
        <div className="text-sm text-[rgba(255,255,255,0.6)]">Payable now</div>
        <div className="text-2xl font-bold mt-1">${cartTotal.toFixed(2)}</div>

        <button
          onClick={() => onPlaceOrder(mockForm, method)}
          className="mt-4 w-full py-3 rounded-xl backdrop-blur-md bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.12)] hover:bg-[rgba(255,255,255,0.12)] transition-all text-white font-semibold"
        >
          Place Order
        </button>
      </div>
    </div>
  );
}
