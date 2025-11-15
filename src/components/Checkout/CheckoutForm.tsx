// components/Checkout/CheckoutForm.tsx
"use client";

import { useState } from "react";

export default function CheckoutForm() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "India",
  });

  const update = (k: keyof typeof form, v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  const InputWrapper: React.FC<
    React.PropsWithChildren<{ className?: string; "aria-label"?: string }>
  > = ({ children, className = "", ...rest }) => (
    <div
      className={`relative ${className} focus-within:ring-1 focus-within:ring-white/20 focus-within:shadow-lg transition-all rounded-lg`}
      {...rest}
    >
      {/* glossy sheen overlay */}
      <span className="pointer-events-none absolute inset-0 rounded-lg bg-gradient-to-b from-[rgba(255,255,255,0.02)] to-[rgba(255,255,255,0.01)] mix-blend-overlay" />
      {children}
    </div>
  );

  const inputBase =
    "w-full backdrop-blur-md bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)] rounded-lg px-4 py-3 text-sm text-white placeholder-[rgba(255,255,255,0.4)] focus:outline-none shadow-inner transition-all";

  return (
    <form className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <InputWrapper className="col-span-1" aria-label="First name field">
        <input
          value={form.firstName}
          onChange={(e) => update("firstName", e.target.value)}
          placeholder="First name"
          className={`${inputBase}`}
        />
      </InputWrapper>

      <InputWrapper className="col-span-1" aria-label="Last name field">
        <input
          value={form.lastName}
          onChange={(e) => update("lastName", e.target.value)}
          placeholder="Last name"
          className={`${inputBase}`}
        />
      </InputWrapper>

      <InputWrapper
        className="col-span-1 sm:col-span-2"
        aria-label="Email address field"
      >
        <input
          value={form.email}
          onChange={(e) => update("email", e.target.value)}
          placeholder="Email address"
          className={`${inputBase}`}
          type="email"
        />
      </InputWrapper>

      <InputWrapper
        className="col-span-1 sm:col-span-2"
        aria-label="Phone field"
      >
        <input
          value={form.phone}
          onChange={(e) => update("phone", e.target.value)}
          placeholder="Phone"
          className={`${inputBase}`}
          inputMode="tel"
        />
      </InputWrapper>

      <InputWrapper
        className="col-span-1 sm:col-span-2"
        aria-label="Street address field"
      >
        <input
          value={form.address}
          onChange={(e) => update("address", e.target.value)}
          placeholder="Street address"
          className={`${inputBase}`}
        />
      </InputWrapper>

      <InputWrapper aria-label="City field">
        <input
          value={form.city}
          onChange={(e) => update("city", e.target.value)}
          placeholder="City"
          className={`${inputBase}`}
        />
      </InputWrapper>

      <InputWrapper aria-label="State / Province field">
        <input
          value={form.state}
          onChange={(e) => update("state", e.target.value)}
          placeholder="State / Province"
          className={`${inputBase}`}
        />
      </InputWrapper>

      <InputWrapper aria-label="ZIP / PIN field">
        <input
          value={form.zip}
          onChange={(e) => update("zip", e.target.value)}
          placeholder="ZIP / PIN"
          className={`${inputBase}`}
        />
      </InputWrapper>

      <InputWrapper
        className="col-span-1 sm:col-span-2"
        aria-label="Country field"
      >
        <input
          value={form.country}
          onChange={(e) => update("country", e.target.value)}
          placeholder="Country"
          className={`${inputBase}`}
        />
      </InputWrapper>
    </form>
  );
}
