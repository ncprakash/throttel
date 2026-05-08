import { supabase } from "@/lib/supabase";
import nodemailer from "nodemailer";

// ── Types ────────────────────────────────────────────────────────────────────
export interface OrderItem {
  order_item_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
}

export interface FullOrder {
  order_id: string;
  customer_name?: string;
  customer_email?: string;
  customer_phone?: string;
  shipping_address?: string;
  shipping_city?: string;
  shipping_state?: string;
  shipping_postal_code?: string;
  shipping_country?: string;
  notes?: string;
  order_items: OrderItem[];
}

// ── ShipRocket auth (cached per cold-start) ──────────────────────────────────
let _tokenCache: { token: string; expiresAt: number } | null = null;

async function getShipRocketToken(): Promise<string> {
  if (_tokenCache && Date.now() < _tokenCache.expiresAt) return _tokenCache.token;

  const res = await fetch("https://apiv2.shiprocket.in/v1/external/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: process.env.SHIPROCKET_EMAIL,
      password: process.env.SHIPROCKET_PASSWORD,
    }),
  });
  const data = await res.json();
  if (!data.token) throw new Error("ShipRocket auth failed: " + JSON.stringify(data));

  // tokens last 24 h — cache for 23 h
  _tokenCache = { token: data.token, expiresAt: Date.now() + 23 * 60 * 60 * 1000 };
  return data.token;
}

// ── Retry helper ─────────────────────────────────────────────────────────────
async function withRetry<T>(fn: () => Promise<T>, attempts = 3, delayMs = 1500): Promise<T> {
  let lastErr: unknown;
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (err) {
      lastErr = err;
      if (i < attempts - 1) await new Promise((r) => setTimeout(r, delayMs * (i + 1)));
    }
  }
  throw lastErr;
}

// ── Create ShipRocket order ───────────────────────────────────────────────────
async function createShipRocketOrder(order: FullOrder, token: string): Promise<string> {
  const rawPhone = order.customer_phone || "";
  const digitsOnly = rawPhone.replace(/\D/g, "");
  // Strip country code only when number is 12+ digits (e.g. 919164801744 → 9164801744)
  // A 10-digit number starting with 91 (e.g. 9164801744) must NOT be stripped
  const cleanPhone = digitsOnly.length > 10 ? digitsOnly.replace(/^91/, "").slice(-10) : digitsOnly;
  if (cleanPhone.length !== 10) {
    throw new Error(`Invalid phone "${rawPhone}" — need 10-digit Indian mobile`);
  }

  const srItems = order.order_items.map((item) => ({
    name: item.product_name || "Product",
    sku: `SKU-${item.order_item_id}`,
    units: item.quantity,
    selling_price: String(item.unit_price || 0),
  }));

  const subtotal = order.order_items.reduce(
    (s, i) => s + i.quantity * (i.unit_price || 0),
    0
  );

  const now = new Date();
  const orderDate = `${now.toISOString().split("T")[0]} ${now.getHours()}:${String(now.getMinutes()).padStart(2, "0")}`;

  const payload = {
    order_id: String(order.order_id),
    order_date: orderDate,
    pickup_location: "warehouse",
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
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok || !data.order_id) {
    throw new Error("ShipRocket rejected: " + JSON.stringify(data));
  }

  return String(data.order_id);
}

// ── Send confirmation email ───────────────────────────────────────────────────
async function sendConfirmationEmail(
  order: FullOrder,
  razorpay_payment_id: string,
  shiprocketOrderId: string | null
) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });

  const totalAmount = order.order_items.reduce(
    (s, i) => s + i.quantity * (i.unit_price || 0),
    0
  );

  await transporter.sendMail({
    from: `"Throttle Forged Customs" <${process.env.SMTP_USER}>`,
    to: order.customer_email,
    subject: `Order Confirmed!`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#333">
        <h1 style="color:#000;text-align:center">Order Confirmed!</h1>
        <div style="background:#f8f9fa;padding:20px;border-radius:12px;margin:20px 0">
          <p><strong>Hey ${order.customer_name || "Rider"},</strong></p>
          <p>Your order has been confirmed and is being prepared for shipping!</p>
        </div>
        <div style="background:white;padding:24px;border-radius:12px;border:1px solid #eee;margin:20px 0">
          <h3 style="color:#000;margin-top:0">Order Details</h3>
          <table style="width:100%;border-collapse:collapse">
            ${order.order_items.map((item) => `
              <tr style="border-bottom:1px solid #eee">
                <td style="padding:10px 0">
                  <strong>${item.product_name}</strong><br>
                  <small>Qty: ${item.quantity} × ₹${item.unit_price}</small>
                </td>
                <td style="text-align:right;font-weight:bold">₹${item.quantity * item.unit_price}</td>
              </tr>`).join("")}
            <tr>
              <td style="text-align:right;padding-top:12px;font-weight:bold">Total:</td>
              <td style="text-align:right;font-size:20px;font-weight:bold">₹${totalAmount}</td>
            </tr>
          </table>
        </div>
        <div style="background:#e3f2fd;padding:20px;border-radius:12px;margin:20px 0">
          <h3 style="color:#1976d2;margin-top:0">What happens next?</h3>
          <ul style="color:#333;padding-left:20px;margin:0">
            <li>✅ Payment verified (ID: ${razorpay_payment_id})</li>
            <li>📦 Order being prepared</li>
            <li>🚚 Shipping within 2–3 business days</li>
          </ul>
        </div>
        ${shiprocketOrderId ? `
        <a href="https://www.shiprocket.in/shipment-tracking/?id=${shiprocketOrderId}"
           style="display:inline-block;background:#2e7d32;color:white;padding:12px 24px;
                  border-radius:8px;text-decoration:none;font-weight:bold;margin-top:8px">
          Track Your Package
        </a>` : ""}
        <p style="color:#666;text-align:center;margin-top:24px">
          Need help? <a href="mailto:support@throttleforged.com">Contact Support</a>
        </p>
      </div>`,
  });
}

// ── Main entry point ──────────────────────────────────────────────────────────
/**
 * Run all post-payment steps: update DB, create ShipRocket order, send email.
 * Safe to call from both verify-payment (client callback) and Razorpay webhook.
 */
export async function processConfirmedPayment(
  order_id: string,
  razorpay_payment_id: string
): Promise<{ shiprocketOrderId: string | null; shiprocketError: string | null }> {
  // 1. Update order status in DB
  const { error: updateError } = await supabase
    .from("orders")
    .update({ status: "confirmed", payment_status: "paid", razorpay_payment_id })
    .eq("order_id", order_id);

  if (updateError) throw new Error("DB update failed: " + updateError.message);

  // 2. Fetch full order with items
  const { data: order, error: fetchError } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("order_id", order_id)
    .single();

  if (fetchError || !order) throw new Error("Order not found after DB update");

  // Legacy fallback: parse customer fields from JSON notes
  if (!order.customer_name && order.notes) {
    try {
      const p = JSON.parse(order.notes);
      Object.assign(order, {
        customer_name: p.customer_name,
        customer_email: p.customer_email,
        customer_phone: p.customer_phone,
        shipping_address: p.shipping_address,
        shipping_city: p.shipping_city,
        shipping_state: p.shipping_state,
        shipping_postal_code: p.shipping_postal_code,
        shipping_country: p.shipping_country || "India",
      });
    } catch { /* notes is plain text, not JSON */ }
  }

  // 3. ShipRocket — 3 attempts with back-off
  let shiprocketOrderId: string | null = null;
  let shiprocketError: string | null = null;

  try {
    shiprocketOrderId = await withRetry(async () => {
      const token = await getShipRocketToken();
      return createShipRocketOrder(order as FullOrder, token);
    }, 3, 1500);

    await supabase
      .from("orders")
      .update({ shiprocket_order_id: shiprocketOrderId, shiprocket_error: null })
      .eq("order_id", order_id);

    console.log(`[ShipRocket] ✅ Created ${shiprocketOrderId} for order ${order_id}`);
  } catch (err) {
    shiprocketError = err instanceof Error ? err.message : String(err);
    console.error(`[ShipRocket] ❌ All retries failed for order ${order_id}:`, shiprocketError);

    // Store the error in DB so admin can see it and retry
    await supabase
      .from("orders")
      .update({ shiprocket_error: shiprocketError })
      .eq("order_id", order_id);
  }

  // 4. Email — non-fatal
  try {
    await sendConfirmationEmail(order as FullOrder, razorpay_payment_id, shiprocketOrderId);
    console.log(`[Email] ✅ Confirmation sent to ${order.customer_email}`);
  } catch (err) {
    console.error(`[Email] ❌ Failed for order ${order_id}:`, err instanceof Error ? err.message : err);
  }

  return { shiprocketOrderId, shiprocketError };
}
