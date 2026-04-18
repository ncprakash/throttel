export type ShippingOption = "normal" | "superfast";

export const SHIPPING_OPTIONS: Record<ShippingOption, { label: string; price: number; description: string }> = {
  normal: { label: "Normal Delivery", price: 80, description: "5–7 business days" },
  superfast: { label: "Superfast Delivery", price: 150, description: "1–2 business days" },
};

export const TAX_RATE = 0.18; // 18% GST
