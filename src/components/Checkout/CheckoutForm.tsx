// components/Checkout/CheckoutForm.tsx
"use client";

type Props = {
  formValues: any;
  onChange: (values: any) => void;
};

export default function CheckoutForm({ formValues, onChange }: Props) {
  const handleChange = (field: string, value: string) => {
    onChange({ ...formValues, [field]: value });
  };

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
        <label className="text-sm text-white/60">Phone</label>
        <input
          type="tel"
          value={formValues.customer_phone}
          onChange={(e) => handleChange("customer_phone", e.target.value)}
          className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white"
        />
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
    </div>
  );
}
