import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { supabase } from "@/lib/supabase";

// ── Email ────────────────────────────────────────────────────────────────────
const createTransport = () =>
  nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });

// ── ShipRocket ───────────────────────────────────────────────────────────────
async function getShipRocketToken(): Promise<string> {
  const res = await fetch("https://apiv2.shiprocket.in/v1/external/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: process.env.SHIPROCKET_EMAIL,
      password: process.env.SHIPROCKET_PASSWORD,
    }),
  });
  const data = await res.json();
  if (!data.token) throw new Error("ShipRocket login failed: " + JSON.stringify(data));
  return data.token;
}

interface OrderItem {
  order_item_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
}

interface Order {
  order_id: string;
  order_items: OrderItem[];
  customer_name?: string;
  customer_email?: string;
  customer_phone?: string;
  shipping_address?: string;
  shipping_city?: string;
  shipping_state?: string;
  shipping_postal_code?: string;
  shipping_country?: string;
  notes?: string;
}

async function createShipRocketOrder(order: Order, token: string) {
  const srItems = order.order_items.map((item) => ({
    name: item.product_name || "Product",
    sku: `SKU-${item.order_item_id}`,
    units: item.quantity,
    selling_price: String(item.unit_price || 0),
  }));

  const subtotal = order.order_items.reduce(
    (sum, item) => sum + item.quantity * (item.unit_price || 0),
    0
  );

  const now = new Date();
  const orderDate = `${now.toISOString().split("T")[0]} ${now.getHours()}:${String(now.getMinutes()).padStart(2, "0")}`;

  const rawPhone = order.customer_phone || "";
  const cleanPhone = rawPhone.replace(/\D/g, "").replace(/^91/, "").slice(-10);
  if (cleanPhone.length !== 10) {
    throw new Error(`Invalid phone: "${rawPhone}". Need 10-digit Indian mobile.`);
  }

  const payload = {
    order_id: String(order.order_id),
    order_date: orderDate,
    pickup_location: "wearhouse",
    billing_customer_name: order.customer_name || "Customer",
    billing_last_name: "",
    billing_address: order.shipping_address || "N/A",
    billing_address_2: "",
    billing_city: order.shipping_city || "N/A",
    billing_pincode: order.shipping_postal_code || "000000",
    billing_state: order.shipping_state || "N/A",
    billing_country: order.shipping_country || "India",
    billing_email: order.customer_email || "",
    billing_phone: cleanPhone,
    shipping_is_billing: true,
    order_items: srItems,
    payment_method: "Prepaid",
    sub_total: subtotal,
    length: 10,
    breadth: 10,
    height: 10,
    weight: 0.5,
  };

  const res = await fetch("https://apiv2.shiprocket.in/v1/external/orders/create/adhoc", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok || !data.order_id) {
    throw new Error("ShipRocket failed: " + JSON.stringify(data));
  }
  return data;
}

// ── Post-payment processing (shared with verify-payment) ────────────────────
async function processConfirmedPayment(
  order_id: string,
  razorpay_payment_id: string
) {
  // 1. Update order status
  const { error: updateError } = await supabase
    .from("orders")
    .update({ status: "confirmed", payment_status: "paid", razorpay_payment_id })
    .eq("order_id", order_id);

  if (updateError) {
    throw new Error("DB update failed: " + updateError.message);
  }

  // 2. Fetch full order with items
  const { data: order, error: fetchError } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("order_id", order_id)
    .single();

  if (fetchError || !order) {
    throw new Error("Order not found after update");
  }

  // Parse customer fields from notes if stored as JSON (legacy fallback)
  if (!order.customer_name && order.notes) {
    try {
      const parsed = JSON.parse(order.notes);
      order.customer_name = parsed.customer_name;
      order.customer_email = parsed.customer_email;
      order.customer_phone = parsed.customer_phone;
      order.shipping_address = parsed.shipping_address;
      order.shipping_city = parsed.shipping_city;
      order.shipping_state = parsed.shipping_state;
      order.shipping_postal_code = parsed.shipping_postal_code;
      order.shipping_country = parsed.shipping_country || "India";
    } catch {
      // notes is not JSON
    }
  }

  // 3. ShipRocket
  let shiprocketOrderId: string | null = null;
  let shiprocketError: string | null = null;
  try {
    const srToken = await getShipRocketToken();
    const srOrder = await createShipRocketOrder(order as Order, srToken);
    shiprocketOrderId = String(srOrder.order_id);
    await supabase
      .from("orders")
      .update({ shiprocket_order_id: shiprocketOrderId })
      .eq("order_id", order_id);
    console.log("[ShipRocket] Order created:", shiprocketOrderId);
  } catch (srErr) {
    shiprocketError = srErr instanceof Error ? srErr.message : String(srErr);
    console.error("[ShipRocket] FAILED:", shiprocketError);
  }

  // 4. Email
  try {
    const transporter = createTransport();
    const totalAmount = (order.order_items as OrderItem[]).reduce(
      (sum, item) => sum + item.quantity * (item.unit_price || 0),
      0
    );

    await transporter.sendMail({
      from: `"Throttle Forged Customs" <${process.env.SMTP_USER}>`,
      to: order.customer_email,
      subject: `Order #${order_id} Confirmed!`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <h1 style="color: #000; text-align: center;">Order Confirmed!</h1>
          <div style="background: #f8f9fa; padding: 20px; border-radius: 12px; margin: 20px 0;">
            <h2 style="color: #000; margin-top: 0;">Order #${order_id}</h2>
            <p><strong>Hey ${order.customer_name || "Rider"},</strong></p>
            <p>Your order has been confirmed and is being prepared for shipping!</p>
          </div>
          <div style="background: white; padding: 24px; border-radius: 12px; border: 1px solid #eee; margin: 20px 0;">
            <h3 style="color: #000; margin-top: 0;">Order Details</h3>
            <table style="width: 100%; border-collapse: collapse;">
              ${(order.order_items as OrderItem[]).map((item) => `
                <tr style="border-bottom: 1px solid #eee;">
                  <td style="padding: 10px 0;">
                    <strong>${item.product_name}</strong><br>
                    <small>Qty: ${item.quantity} x Rs.${item.unit_price}</small>
                  </td>
                  <td style="text-align: right; font-weight: bold;">
                    Rs.${item.quantity * item.unit_price}
                  </td>
                </tr>
              `).join("")}
              <tr>
                <td style="text-align: right; padding-top: 12px; font-weight: bold;">Total:</td>
                <td style="text-align: right; font-size: 20px; font-weight: bold;">Rs.${totalAmount}</td>
              </tr>
            </table>
          </div>
          <div style="background: #e3f2fd; padding: 20px; border-radius: 12px; margin: 20px 0;">
            <h3 style="color: #1976d2; margin-top: 0;">Next Steps</h3>
            <ul style="color: #333; padding-left: 20px; margin: 0;">
              <li>Payment verified (Razorpay ID: ${razorpay_payment_id})</li>
              <li>Order being prepared</li>
              <li>Shipping within 2-3 business days</li>
            </ul>
          </div>
          <p style="margin: 8px 0;">ShipRocket Order ID: <strong>${shiprocketOrderId ?? "Pending"}</strong></p>
          ${shiprocketOrderId ? `
          <a href="https://www.shiprocket.in/shipment-tracking/?id=${shiprocketOrderId}"
             style="display: inline-block; background: #2e7d32; color: white; padding: 12px 24px;
                    border-radius: 8px; text-decoration: none; font-weight: bold; margin-top: 8px;">
            Track Package
          </a>` : ""}
          <p style="color: #666; text-align: center; margin-top: 20px;">
            Need help? <a href="mailto:support@throttleforged.com">Contact Support</a>
          </p>
        </div>
      `,
    });
    console.log("[Email] Confirmation sent to", order.customer_email);
  } catch (emailErr) {
    console.error("[Email] FAILED:", emailErr);
  }

  return { shiprocketOrderId, shiprocketError };
}

// ── Webhook endpoint ─────────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("x-razorpay-signature") || "";
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.error("[Webhook] RAZORPAY_WEBHOOK_SECRET not set");
      return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 });
    }

    // Verify webhook signature
    const expectedSig = crypto
      .createHmac("sha256", webhookSecret)
      .update(rawBody)
      .digest("hex");

    if (expectedSig !== signature) {
      console.error("[Webhook] Invalid signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const event = JSON.parse(rawBody);
    console.log("[Webhook] Event received:", event.event);

    // Only handle payment.captured
    if (event.event !== "payment.captured") {
      return NextResponse.json({ received: true });
    }

    const payment = event.payload?.payment?.entity;
    if (!payment) {
      return NextResponse.json({ error: "No payment entity" }, { status: 400 });
    }

    const razorpay_payment_id: string = payment.id;
    const razorpay_order_id: string = payment.order_id;

    console.log("[Webhook] Payment captured:", razorpay_payment_id, "for Razorpay order:", razorpay_order_id);

    // Look up our internal order by razorpay_order_id
    const { data: order, error: lookupError } = await supabase
      .from("orders")
      .select("order_id, payment_status")
      .eq("razorpay_order_id", razorpay_order_id)
      .single();

    if (lookupError || !order) {
      console.error("[Webhook] Order not found for razorpay_order_id:", razorpay_order_id);
      // Return 200 so Razorpay doesn't retry — we'll log it for manual follow-up
      return NextResponse.json({ received: true, warning: "Order not found" });
    }

    // Skip if already confirmed (idempotency — webhook may fire multiple times)
    if (order.payment_status === "paid") {
      console.log("[Webhook] Order already confirmed, skipping:", order.order_id);
      return NextResponse.json({ received: true, skipped: true });
    }

    await processConfirmedPayment(order.order_id, razorpay_payment_id);

    console.log("[Webhook] Order fully processed:", order.order_id);
    return NextResponse.json({ received: true, order_id: order.order_id });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Webhook processing failed";
    console.error("[Webhook] Error:", message);
    // Return 200 to prevent Razorpay from retrying on unrecoverable errors
    return NextResponse.json({ received: true, error: message });
  }
}
