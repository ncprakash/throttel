// components/Checkout/CheckoutForm.tsx
"use client";

import Link from "next/link";

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
  const handleChange = (field: string, value: string) => {
    onChange({ ...formValues, [field]: value });
  };

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

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm text-white/60">City *</label>
          <input
            type="text"
            value={formValues.shipping_city}
            onChange={(e) => handleChange("shipping_city", e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white"
            required
          />
        </div>

        <div>
          <label className="text-sm text-white/60">State *</label>
          <input
            type="text"
            value={formValues.shipping_state}
            onChange={(e) => handleChange("shipping_state", e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm text-white/60">Postal Code *</label>
          <input
            type="text"
            value={formValues.shipping_postal_code}
            onChange={(e) => handleChange("shipping_postal_code", e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white"
            required
          />
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
