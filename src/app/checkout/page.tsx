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

import { SHIPPING_OPTIONS, TAX_RATE, type ShippingOption } from "@/lib/commerce";

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
  const [agreedToTerms, setAgreedToTerms] = useState(false);
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

    const savedShipping = localStorage.getItem(
      "shippingOption"
    ) as ShippingOption | null;
    if (savedShipping && SHIPPING_OPTIONS[savedShipping]) {
      setSelectedShipping(savedShipping);
    }

    loadCart();
  }, []);

  // Totals
  const subtotal = cartItems.reduce((sum, item) => {
    const price = item.product?.sale_price ?? item.product?.regular_price ?? 0;
    const variantPrice = item.variant?.additional_price || 0;
    return sum + (price + variantPrice) * item.quantity;
  }, 0);

  const shipping = SHIPPING_OPTIONS[selectedShipping].price;
  const tax = Math.round(subtotal * TAX_RATE);
  const total = subtotal + shipping + tax;

  // Razorpay Payment Handler
  const handleRazorpayPayment = async (orderData: any) => {
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

    const digits = formValues.customer_phone.replace(/\D/g, "");
    const cleanedPhone =
      digits.length > 10
        ? digits.replace(/^91/, "").slice(-10)
        : digits;
    if (cleanedPhone.length !== 10 || !/^[6-9]/.test(cleanedPhone)) {
      toast.error("Enter a valid 10-digit Indian mobile number");
      return;
    }

    if (!agreedToTerms) {
      toast.error(
        "Please read and accept the Terms & Conditions to continue"
      );
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
          unit_price: item.product.sale_price ?? item.product.regular_price,
          total_price:
            (item.product.sale_price ?? item.product.regular_price) *
            item.quantity,
        })),
        subtotal,
        shipping_charges: shipping,
        tax_amount: tax,
        total_amount: total,
      };

      console.log("[handlePlaceOrder] Order payload prepared:", orderPayload);

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

      await handleRazorpayPayment({ ...data });
    } catch (error: any) {
      console.error("[handlePlaceOrder] Order failed:", error);
      toast.error(error.message || "Order failed");
      setPlacingOrder(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-8">
        <div className="text-center">
          <div className="w-12 h-12 border border-white/20 border-t-white/60 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[10px] tracking-[0.4em] text-white/30 uppercase">
            Preparing checkout
          </p>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-8">
        <div className="border border-white/8 rounded-3xl p-12 text-center max-w-md mx-auto bg-white/[0.02]">
          <div className="text-[5rem] font-black text-white/5 leading-none mb-6 select-none">
            ∅
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">
            Your cart is empty
          </h2>
          <p className="text-sm text-white/50 mb-8">
            Add motorcycle accessories to continue
          </p>
          <button
            onClick={() => router.push("/shop")}
            className="px-8 py-4 rounded-xl bg-white text-black text-sm font-bold hover:bg-white/90 transition-colors"
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

      <div className="min-h-screen bg-black text-white pb-32">
        {/* Page header */}
        <div className="border-b border-white/5">
          <div className="max-w-7xl mx-auto px-4 py-12">
            <p className="text-[10px] tracking-[0.4em] text-white/30 uppercase mb-3">
              Secure payment
            </p>
            <div className="flex items-end gap-6">
              <h1 className="text-5xl sm:text-7xl font-black tracking-[-0.04em] leading-none uppercase">
                Checkout
              </h1>
              <span className="text-sm text-white/30 mb-2 tracking-wide">
                via Razorpay
              </span>
            </div>
            {session?.user && (
              <p className="text-xs text-white/30 mt-3">
                {session.user.email}
              </p>
            )}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-10">
          <div className="grid lg:grid-cols-[1fr_400px] gap-8 items-start">
            {/* Shipping Form */}
            <div className="space-y-6">
              <div className="border border-white/8 rounded-2xl p-8 bg-white/[0.02]">
                <p className="text-[10px] tracking-[0.3em] text-white/30 uppercase mb-6">
                  Shipping &amp; Contact
                </p>
                <CheckoutForm
                  formValues={formValues}
                  onChange={setFormValues}
                  agreedToTerms={agreedToTerms}
                  onTermsChange={setAgreedToTerms}
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

              <div className="border border-white/8 rounded-2xl p-8 bg-white/[0.02]">
                <p className="text-[10px] tracking-[0.3em] text-white/30 uppercase mb-6">
                  Order Items ({cartItems.length})
                </p>
                <OrderReview items={cartItems} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
