"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

type Props = {
  formValues: any;
  onChange: (values: any) => void;
  agreedToTerms: boolean;
  onTermsChange: (agreed: boolean) => void;
};

function normalizePhone(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  return digits.length > 10 ? digits.replace(/^91/, "").slice(-10) : digits;
}

function isValidPhone(raw: string): boolean {
  const cleaned = normalizePhone(raw);
  return cleaned.length === 10 && /^[6-9]/.test(cleaned);
}

export default function CheckoutForm({ formValues, onChange, agreedToTerms, onTermsChange }: Props) {
  const [pincodeStatus, setPincodeStatus] = useState<"idle" | "loading" | "found" | "error">("idle");
  const [pincodeHint, setPincodeHint] = useState("");

  const handleChange = (field: string, value: string) => {
    onChange({ ...formValues, [field]: value });
  };

  // Reset pincode status whenever the code changes
  const handlePincodeChange = (value: string) => {
    onChange({ ...formValues, shipping_postal_code: value });
    if (pincodeStatus !== "idle") setPincodeStatus("idle");
    if (pincodeHint) setPincodeHint("");
  };

  useEffect(() => {
    const code = formValues.shipping_postal_code;
    if (!/^\d{6}$/.test(code)) return;

    let cancelled = false;
    setPincodeStatus("loading");

    fetch(`/api/pincode/${code}`)
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        if (data.city && data.state) {
          onChange({ ...formValues, shipping_city: data.city, shipping_state: data.state });
          setPincodeHint(`${data.city}, ${data.state}`);
          setPincodeStatus("found");
        } else {
          setPincodeStatus("error");
          setPincodeHint("");
        }
      })
      .catch(() => {
        if (!cancelled) setPincodeStatus("error");
      });

    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formValues.shipping_postal_code]);

  const phoneError =
    formValues.customer_phone && !isValidPhone(formValues.customer_phone)
      ? "Enter a valid 10-digit Indian mobile number"
      : null;

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm text-white/60">Full Name *</label>
        <input
          type="text"
          value={formValues.customer_name}
          onChange={(e) => handleChange("customer_name", e.target.value)}
          className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white"
          required
        />
      </div>

      <div>
        <label className="text-sm text-white/60">Email *</label>
        <input
          type="email"
          value={formValues.customer_email}
          onChange={(e) => handleChange("customer_email", e.target.value)}
          className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white"
          required
        />
      </div>

      <div>
        <label className="text-sm text-white/60">Phone *</label>
        <input
          type="tel"
          value={formValues.customer_phone}
          onChange={(e) => handleChange("customer_phone", e.target.value)}
          maxLength={13}
          placeholder="10-digit mobile number"
          className={`w-full px-4 py-2 rounded-lg bg-white/5 border text-white ${
            phoneError ? "border-red-500" : "border-white/10"
          }`}
          required
        />
        {phoneError && (
          <p className="text-red-400 text-xs mt-1">{phoneError}</p>
        )}
      </div>

      <div>
        <label className="text-sm text-white/60">Address *</label>
        <textarea
          value={formValues.shipping_address}
          onChange={(e) => handleChange("shipping_address", e.target.value)}
          rows={3}
          className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white"
          required
        />
      </div>

      {/* Pincode first — city/state auto-fill from it */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm text-white/60">Postal Code *</label>
          <div className="relative">
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6}
              value={formValues.shipping_postal_code}
              onChange={(e) => handlePincodeChange(e.target.value.replace(/\D/g, ""))}
              placeholder="6-digit pincode"
              className={`w-full px-4 py-2 rounded-lg bg-white/5 border text-white pr-9 ${
                pincodeStatus === "error"
                  ? "border-red-500"
                  : pincodeStatus === "found"
                  ? "border-green-500/60"
                  : "border-white/10"
              }`}
              required
            />
            {pincodeStatus === "loading" && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2">
                <span className="block w-4 h-4 border-2 border-white/20 border-t-white/70 rounded-full animate-spin" />
              </span>
            )}
            {pincodeStatus === "found" && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-green-400 text-sm">✓</span>
            )}
          </div>
          {pincodeStatus === "found" && pincodeHint && (
            <p className="text-green-400 text-xs mt-1">{pincodeHint}</p>
          )}
          {pincodeStatus === "error" && (
            <p className="text-red-400 text-xs mt-1">Pincode not found</p>
          )}
        </div>

        <div>
          <label className="text-sm text-white/60">Country</label>
          <input
            type="text"
            value={formValues.shipping_country}
            onChange={(e) => handleChange("shipping_country", e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm text-white/60">City *</label>
          <input
            type="text"
            value={formValues.shipping_city}
            onChange={(e) => handleChange("shipping_city", e.target.value)}
            placeholder="Auto-filled from pincode"
            className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/20"
            required
          />
        </div>

        <div>
          <label className="text-sm text-white/60">State *</label>
          <input
            type="text"
            value={formValues.shipping_state}
            onChange={(e) => handleChange("shipping_state", e.target.value)}
            placeholder="Auto-filled from pincode"
            className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/20"
            required
          />
        </div>
      </div>

      {/* Terms & Conditions agreement */}
      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={agreedToTerms}
          onChange={(e) => onTermsChange(e.target.checked)}
          className="mt-1 h-4 w-4 shrink-0 accent-white cursor-pointer"
        />
        <span className={`text-sm leading-relaxed ${agreedToTerms ? "text-white/80" : "text-white/60"}`}>
          I have read and agree to the{" "}
          <Link
            href="/terms"
            target="_blank"
            className="underline text-white hover:text-white/80 transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            Terms &amp; Conditions
          </Link>
          {" "}including the product usage responsibility, no-return policy, and all disclaimers.
        </span>
      </label>
    </div>
  );
}
