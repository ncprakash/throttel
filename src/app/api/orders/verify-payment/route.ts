import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { supabase } from "@/lib/supabase";
import nodemailer from "nodemailer";

const createTransport = () =>
  nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });

// ── ShipRocket helpers ────────────────────────────────────────────────────────
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
  console.log("ShipRocket login:", JSON.stringify(data));
  if (!data.token) throw new Error("ShipRocket login failed: " + JSON.stringify(data));
  return data.token;
}

async function createShipRocketOrder(order: any, token: string) {
  const srItems = order.order_items.map((item: any) => ({
    name: item.product_name || "Product",
    sku: `SKU-${item.order_item_id}`,
    units: item.quantity,
    selling_price: String(item.unit_price || 0),
  }));

  const subtotal = order.order_items.reduce(
    (sum: number, item: any) => sum + item.quantity * (item.unit_price || 0),
    0
  );

  const payload = {
    order_id: String(order.order_id),
    order_date: new Date().toISOString().split("T")[0],
    pickup_location: "home", // change to match your ShipRocket pickup name

    billing_customer_name: order.customer_name || "Customer",
    billing_last_name: "",
    billing_address: order.shipping_address || "N/A",
    billing_address_2: "",
    billing_city: order.shipping_city || "N/A",
    billing_pincode: order.shipping_postal_code || "000000",
    billing_state: order.shipping_state || "N/A",
    billing_country: order.shipping_country || "India",
    billing_email: order.customer_email || "",
    billing_phone: order.customer_phone || "0000000000",

    shipping_is_billing: true,

    order_items: srItems,
    payment_method: "Prepaid",
    sub_total: subtotal,
    length: 10,
    breadth: 10,
    height: 10,
    weight: 0.5,
  };

  console.log("ShipRocket payload:", JSON.stringify(payload));

  const res = await fetch(
    "https://apiv2.shiprocket.in/v1/external/orders/create/adhoc",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    }
  );
  const data = await res.json();
  console.log("ShipRocket response:", JSON.stringify(data));
  if (!res.ok) throw new Error("ShipRocket failed: " + JSON.stringify(data));
  return data;
}
// ─────────────────────────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("Verify payment body:", JSON.stringify(body));

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, order_id } = body;

    // Signature check — order matters: razorpay_order_id FIRST, then razorpay_payment_id
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(sign)
      .digest("hex");

    console.log("Signature match:", expectedSign === razorpay_signature);
    console.log("  received:", razorpay_signature);
    console.log("  expected:", expectedSign);

    if (expectedSign !== razorpay_signature) {
      return NextResponse.json({ success: false, error: "Invalid signature" }, { status: 400 });
    }

    // Fetch order — use * to get all columns (avoids missing column errors)
    const { data: order, error: fetchError } = await supabase
      .from("orders")
      .select("*, order_items(*)")
      .eq("order_id", order_id)
      .single();

    console.log("Fetched order:", JSON.stringify(order));
    console.log("Fetch error:", JSON.stringify(fetchError));

    if (fetchError || !order) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
    }

    // If customer fields are stored as JSON in notes, parse them out
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
        console.log("Parsed customer info from notes JSON");
      } catch {
        console.warn("Could not parse notes as JSON:", order.notes);
      }
    }

    console.log("Customer:", order.customer_name, order.customer_email);
    console.log("Address:", order.shipping_address, order.shipping_city, order.shipping_postal_code);

    // Update order to paid
    const { error: updateError } = await supabase
      .from("orders")
      .update({ status: "confirmed", payment_status: "paid", razorpay_payment_id })
      .eq("order_id", order_id);

    if (updateError) console.error("Order update error:", updateError);
    else console.log("Order updated to confirmed/paid");

    // ShipRocket
    try {
      const srToken = await getShipRocketToken();
      const srOrder = await createShipRocketOrder(order, srToken);
      await supabase
        .from("orders")
        .update({ shiprocket_order_id: String(srOrder.order_id) })
        .eq("order_id", order_id);
      console.log("ShipRocket order created:", srOrder.order_id);
    } catch (srError) {
      console.error("ShipRocket error (non-fatal):", srError);
    }

    // Confirmation email
    try {
      const transporter = createTransport();
      const totalAmount = order.order_items.reduce(
        (sum: number, item: any) => sum + item.quantity * (item.unit_price || 0),
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
                ${order.order_items.map((item: any) => `
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
            <p style="color: #666; text-align: center;">
              Need help? <a href="mailto:support@throttleforged.com">Contact Support</a>
            </p>
          </div>
        `,
      });
      console.log("Email sent to", order.customer_email);
    } catch (mailError) {
      console.error("Email error (non-fatal):", mailError);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json({ success: false, error: "Verification failed" }, { status: 500 });
  }
}