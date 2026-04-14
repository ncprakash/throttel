// app/checkout/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import Script from "next/script";

import CheckoutForm from "@/components/Checkout/CheckoutForm";
import CheckoutSummary from "@/components/Checkout/CheckoutSummary";
import OrderReview from "@/components/Checkout/OrderReview";

// ── Shared constants (keep in sync with cart/page.tsx) ──────────────────────
export type ShippingOption = "normal" | "superfast";

export const SHIPPING_OPTIONS: Record<
  ShippingOption,
  { label: string; description: string; price: number }
> = {
  normal: {
    label: "Normal Delivery",
    description: "5–7 business days",
    price: 80,
  },
  superfast: {
    label: "Superfast Delivery",
    description: "1–2 business days",
    price: 150,
  },
};

export const TAX_RATE = 0.18; // 18% GST
// ────────────────────────────────────────────────────────────────────────────

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function CheckoutPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [selectedShipping, setSelectedShipping] =
    useState<ShippingOption>("normal");

  const [formValues, setFormValues] = useState({
    customer_name: "",
    customer_email: "",
    customer_phone: "",
    shipping_address: "",
    shipping_city: "",
    shipping_state: "",
    shipping_postal_code: "",
    shipping_country: "India",
  });

  // Authentication check + prefill
  useEffect(() => {
    if (status === "loading") return;

    if (!session?.user) {
      toast.error("Please sign in to continue");
      router.push("/auth");
      return;
    }

    setFormValues((prev) => ({
      ...prev,
      customer_name: session.user.name || prev.customer_name,
      customer_email: session.user.email || prev.customer_email,
    }));
  }, [session, status, router]);

  // Load cart + restore shipping option saved by cart page
  useEffect(() => {
    const loadCart = () => {
      try {
        const storedCart = localStorage.getItem("cartItems");
        if (storedCart) {
          setCartItems(JSON.parse(storedCart) || []);
        } else {
          setCartItems([]);
        }
      } catch (e) {
        console.error("Failed to load cart:", e);
        setCartItems([]);
      } finally {
        setLoading(false);
      }
    };

    // Restore the shipping option the user picked on the cart page
    const savedShipping = localStorage.getItem(
      "shippingOption",
    ) as ShippingOption | null;
    if (savedShipping && SHIPPING_OPTIONS[savedShipping]) {
      setSelectedShipping(savedShipping);
    }

    loadCart();
  }, []);

  // ── Totals (mirrors cart/page.tsx exactly) ──────────────────────────────
  const subtotal = cartItems.reduce((sum, item) => {
    const price = item.product?.sale_price ?? item.product?.regular_price ?? 0;
    const variantPrice = item.variant?.additional_price || 0;
    return sum + (price + variantPrice) * item.quantity;
  }, 0);

  const shipping = SHIPPING_OPTIONS[selectedShipping].price;
  const tax = Math.round(subtotal * TAX_RATE);
  const total = subtotal + shipping + tax;
  // ────────────────────────────────────────────────────────────────────────

  // Razorpay Payment Handler
  const handleRazorpayPayment = async (orderData: any) => {
    console.log("🔥 Razorpay data:", orderData);

    if (!window.Razorpay) {
      toast.error("Payment gateway not ready. Please refresh.");
      setPlacingOrder(false);
      return;
    }

    if (!orderData.razorpay_order_id) {
      toast.error("Payment order failed. Please try again.");
      setPlacingOrder(false);
      return;
    }

    const options: any = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: orderData.amount,
      currency: orderData.currency || "INR",
      name: "Throtter",
      description: `Order #${orderData.order_id.slice(-8).toUpperCase()}`,
      order_id: orderData.razorpay_order_id,
      handler: async (response: any) => {
        try {
          const verifyRes = await fetch("/api/orders/verify-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              order_id: orderData.order_id,
            }),
          });

          const verifyData = await verifyRes.json();

          if (verifyData.success) {
            localStorage.removeItem("cartItems");
            localStorage.removeItem("shippingOption");
            toast.success("Payment successful!");
            router.push(`/order/confirmation/${orderData.order_id}`);
          } else {
            toast.error("Payment verification failed");
          }
        } catch (error) {
          toast.error("Payment verification failed");
        } finally {
          setPlacingOrder(false);
        }
      },
      prefill: {
        name: formValues.customer_name,
        email: formValues.customer_email,
        contact: formValues.customer_phone,
      },
      theme: { color: "#000000" },
      modal: {
        ondismiss: () => {
          setPlacingOrder(false);
          toast.info("Payment cancelled");
        },
      },
    };

    try {
      const razorpay = new window.Razorpay(options);
      razorpay.on("payment.failed", () => {
        setPlacingOrder(false);
        toast.error("Payment failed");
      });
      razorpay.open();
      console.log("✅ Razorpay opened");
    } catch (error) {
      setPlacingOrder(false);
      toast.error("Failed to open payment");
    }
  };

  // Place Order
  const handlePlaceOrder = async () => {
    console.log("[handlePlaceOrder] Started");

    if (
      !formValues.customer_name ||
      !formValues.customer_email ||
      !formValues.customer_phone
    ) {
      console.warn("[handlePlaceOrder] Missing required customer info");
      toast.error("Please fill all required fields");
      return;
    }

    if (cartItems.length === 0) {
      console.warn("[handlePlaceOrder] Cart is empty");
      toast.error("Cart is empty");
      return;
    }

    setPlacingOrder(true);
    console.log("[handlePlaceOrder] PlacingOrder set to true");

    try {
      const orderPayload = {
        user_id: session!.user.id,
        customer_name: formValues.customer_name,
        customer_email: formValues.customer_email,
        customer_phone: formValues.customer_phone,
        shipping_address: formValues.shipping_address,
        shipping_city: formValues.shipping_city,
        shipping_state: formValues.shipping_state,
        shipping_postal_code: formValues.shipping_postal_code,
        shipping_country: formValues.shipping_country,
        payment_method: "razorpay",
        items: cartItems.map((item: any) => ({
          product_id: item.product.product_id,
          variant_id: item.variant?.variant_id || null,
          product_name: item.product.name,
          variant_name: item.variant?.name || null,
          quantity: item.quantity,
          unit_price: item.product.sale_price || item.product.regular_price,
          total_price:
            (item.product.sale_price || item.product.regular_price) *
            item.quantity,
        })),
        subtotal,
        shipping_charges: shipping,
        tax_amount: tax,
        total_amount: total,
      };

      console.log("[handlePlaceOrder] Order payload prepared:", orderPayload);

      // 1) Create main order + Razorpay order
      const response = await fetch("/api/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });

      const data = await response.json();
      console.log("[handlePlaceOrder] /api/orders/create response:", data);

      if (!response.ok) {
        throw new Error(data.error || "Order creation failed");
      }

      console.log("✅ Order created successfully:", data);

      // 3) Start Razorpay payment
      await handleRazorpayPayment({ ...data });
    } catch (error: any) {
      console.error("[handlePlaceOrder] Order failed:", error);
      toast.error(error.message || "Order failed");
      setPlacingOrder(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center p-8">
        <div className="backdrop-blur-xl bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded-2xl p-12 text-center">
          <div className="w-16 h-16 border-4 border-[rgba(255,255,255,0.16)] border-t-white rounded-full animate-spin mx-auto mb-6" />
          <p className="text-white text-xl">Preparing checkout...</p>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center p-8">
        <div className="backdrop-blur-xl bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded-2xl p-12 text-center max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-white mb-4">
            Your cart is empty
          </h2>
          <p className="text-white/60 mb-8">
            Add motorcycle accessories to continue
          </p>
          <button
            onClick={() => router.push("/shop")}
            className="px-8 py-4 rounded-xl bg-white text-black font-semibold hover:bg-white/90 transition-all shadow-xl"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="afterInteractive"
        onLoad={() => {
          console.log("✅ Razorpay script LOADED");
          if (window.Razorpay) {
            console.log("✅ window.Razorpay available:", window.Razorpay);
          }
        }}
        onError={() => {
          console.error("❌ Razorpay script FAILED");
          toast.error("Payment gateway unavailable");
        }}
      />

      <div className="min-h-screen bg-transparent text-white pb-32">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
              Checkout
            </h1>
            <p className="text-xl text-white/60 mt-2">
              Secure payment with Razorpay
            </p>
            {session?.user && (
              <p className="text-sm text-white/50 mt-2">
                Logged in: {session.user.email}
              </p>
            )}
          </div>

          <div className="grid lg:grid-cols-[1fr_420px] gap-8 items-start">
            {/* Shipping Form */}
            <div className="space-y-6">
              <div className="backdrop-blur-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.04)] rounded-3xl p-8">
                <h2 className="text-2xl font-bold mb-6">Shipping & Contact</h2>
                <CheckoutForm
                  formValues={formValues}
                  onChange={setFormValues}
                />
              </div>
            </div>

            {/* Summary + Items */}
            <div className="space-y-6 lg:sticky lg:top-6">
              <CheckoutSummary
                subtotal={subtotal}
                shipping={shipping}
                shippingLabel={SHIPPING_OPTIONS[selectedShipping].label}
                tax={tax}
                total={total}
                itemCount={cartItems.length}
                onPlaceOrder={handlePlaceOrder}
                placingOrder={placingOrder}
              />

              <div className="backdrop-blur-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.04)] rounded-3xl p-8">
                <h3 className="text-xl font-bold mb-6">
                  Order Items ({cartItems.length})
                </h3>
                <OrderReview items={cartItems} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
