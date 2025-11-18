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
  const [shippingMethod, setShippingMethod] = useState<"standard" | "express">("standard");

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

  // Check authentication
  useEffect(() => {
    if (status === "loading") return;
    
    if (!session?.user) {
      toast.error("Please sign in to continue");
      router.push("/auth");
      return;
    }

    // Pre-fill form with user data
    setFormValues((prev) => ({
      ...prev,
      customer_name: session.user.name || prev.customer_name,
      customer_email: session.user.email || prev.customer_email,
    }));
  }, [session, status, router]);

  // Load cart from localStorage
  useEffect(() => {
    const loadCart = () => {
      try {
        const storedCart = localStorage.getItem("cartItems");
        if (storedCart) {
          const parsedCart = JSON.parse(storedCart);
          setCartItems(parsedCart || []);
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

    loadCart();
  }, []);

  // Calculate totals
  const subtotal = cartItems.reduce((s, it) => {
    const price = it.product?.sale_price ?? it.product?.regular_price ?? 0;
    const variant = it.variant?.additional_price || 0;
    return s + (price + variant) * it.quantity;
  }, 0);

  const shipping = shippingMethod === "express" ? 150 : 80;
  const tax = subtotal * 0.18; // 18% GST
  const total = subtotal + shipping + tax;

  // Handle Razorpay Payment
  const handleRazorpayPayment = async (orderData: any) => {
    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: orderData.amount,
      currency: orderData.currency,
      name: "Your Store Name",
      description: "Order Payment",
      order_id: orderData.razorpay_order_id,
      handler: async function (response: any) {
        try {
          // Verify payment
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
            // Clear cart
            localStorage.removeItem("cartItems");
            toast.success("Payment successful!");
            router.push(`/order/confirmation/${orderData.order_id}`);
          } else {
            toast.error("Payment verification failed");
          }
        } catch (error) {
          console.error("Payment verification error:", error);
          toast.error("Payment verification failed");
        }
      },
      prefill: {
        name: formValues.customer_name,
        email: formValues.customer_email,
        contact: formValues.customer_phone,
      },
      theme: {
        color: "#000000",
      },
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();

    razorpay.on("payment.failed", function (response: any) {
      toast.error("Payment failed. Please try again.");
      console.error("Payment failed:", response.error);
    });
  };

  // Handle Place Order
  const handlePlaceOrder = async (paymentMethod: string) => {
    // Validate form
    if (!formValues.customer_name || !formValues.customer_email || !formValues.customer_phone) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      router.push("/cart");
      return;
    }

    if (!session?.user) {
      toast.error("Please sign in to continue");
      router.push("/auth");
      return;
    }

    setPlacingOrder(true);

    try {
      // Prepare order payload
      const orderPayload = {
        user_id: session.user.id,
        customer_name: formValues.customer_name,
        customer_email: formValues.customer_email,
        customer_phone: formValues.customer_phone,
        shipping_address: formValues.shipping_address,
        shipping_city: formValues.shipping_city,
        shipping_state: formValues.shipping_state,
        shipping_postal_code: formValues.shipping_postal_code,
        shipping_country: formValues.shipping_country,
        payment_method: paymentMethod,
        shipping_method: shippingMethod,
        items: cartItems.map(item => ({
          product_id: item.product.product_id,
          variant_id: item.variant?.variant_id || null,
          product_name: item.product.name,
          variant_name: item.variant?.name || null,
          quantity: item.quantity,
          unit_price: item.product.sale_price || item.product.regular_price,
          total_price: (item.product.sale_price || item.product.regular_price) * item.quantity,
        })),
        subtotal: subtotal,
        shipping_charges: shipping,
        tax_amount: tax,
        total_amount: total,
      };

      // Create order in backend
      const response = await fetch("/api/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create order");
      }

      console.log("Order created:", data);

      // If payment method is Razorpay, open checkout
      if (paymentMethod === "razorpay") {
        handleRazorpayPayment(data);
      } else {
        // For COD or other methods
        localStorage.removeItem("cartItems");
        toast.success("Order placed successfully!");
        router.push(`/order/confirmation/${data.order_id}`);
      }
    } catch (error: any) {
      console.error("Order creation failed:", error);
      toast.error(error.message || "Failed to place order");
    } finally {
      setPlacingOrder(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center">
        <div className="backdrop-blur-xl bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded-2xl p-8">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-[rgba(255,255,255,0.16)] border-t-white rounded-full animate-spin" />
            <p className="text-white">Preparing checkout...</p>
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center">
        <div className="backdrop-blur-xl bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Your cart is empty</h2>
          <p className="text-white/60 mb-6">Add items to your cart before checking out</p>
          <button
            onClick={() => router.push("/shop")}
            className="px-6 py-3 rounded-lg bg-white text-black font-semibold hover:bg-white/90 transition"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Load Razorpay Script */}
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="lazyOnload"
      />
      
      <div className="min-h-screen bg-transparent text-white pb-32">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold">Checkout</h1>
            <p className="text-[rgba(255,255,255,0.6)] mt-1">
              Secure checkout — review & place your order
            </p>
            {session?.user && (
              <p className="text-sm text-white/60 mt-2">
                Logged in as: {session.user.email}
              </p>
            )}
          </div>

          <div className="grid lg:grid-cols-[1fr_420px] gap-8 items-start">
            {/* LEFT: Shipping Form */}
            <div className="space-y-6">
              <div className="backdrop-blur-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.04)] rounded-2xl p-6">
                <h2 className="text-lg font-semibold mb-4">Shipping & Contact</h2>
                <CheckoutForm 
                  formValues={formValues}
                  onChange={setFormValues}
                />
              </div>
            </div>

            {/* RIGHT: Summary + Items */}
            <div className="space-y-6 lg:sticky lg:top-4">
              <CheckoutSummary
                subtotal={subtotal}
                shipping={shipping}
                tax={tax}
                total={total}
                itemCount={cartItems.length}
                onChangeShipping={(m) => setShippingMethod(m)}
                shippingMethod={shippingMethod}
                onPlaceOrder={handlePlaceOrder}
                placingOrder={placingOrder}
              />

              <div className="backdrop-blur-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.04)] rounded-2xl p-6">
                <h3 className="text-lg font-semibold mb-4">
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
