import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { supabase } from "@/lib/supabase";
import { processConfirmedPayment } from "@/lib/shiprocket";

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("x-razorpay-signature") || "";
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.error("[Webhook] RAZORPAY_WEBHOOK_SECRET not configured");
      return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 });
    }

    const expectedSig = crypto
      .createHmac("sha256", webhookSecret)
      .update(rawBody)
      .digest("hex");

    if (expectedSig !== signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const event = JSON.parse(rawBody);
    console.log("[Webhook] Event:", event.event);

    if (event.event !== "payment.captured") {
      return NextResponse.json({ received: true });
    }

    const payment = event.payload?.payment?.entity;
    if (!payment) {
      return NextResponse.json({ error: "No payment entity" }, { status: 400 });
    }

    const razorpay_payment_id: string = payment.id;
    const razorpay_order_id: string = payment.order_id;

    // Look up internal order by razorpay_order_id
    const { data: order, error: lookupError } = await supabase
      .from("orders")
      .select("order_id, payment_status")
      .eq("razorpay_order_id", razorpay_order_id)
      .single();

    if (lookupError || !order) {
      console.error("[Webhook] Order not found for razorpay_order_id:", razorpay_order_id);
      // Return 200 so Razorpay doesn't keep retrying
      return NextResponse.json({ received: true, warning: "Order not found" });
    }

    // Idempotent: webhook may fire multiple times
    if (order.payment_status === "paid") {
      console.log("[Webhook] Already processed:", order.order_id);
      return NextResponse.json({ received: true, skipped: true });
    }

    console.log("[Webhook] Processing payment for order:", order.order_id);
    const { shiprocketOrderId, shiprocketError } = await processConfirmedPayment(
      order.order_id,
      razorpay_payment_id
    );

    console.log("[Webhook] Done. ShipRocket:", shiprocketOrderId ?? `FAILED: ${shiprocketError}`);
    return NextResponse.json({ received: true, order_id: order.order_id, shiprocket_order_id: shiprocketOrderId });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Webhook error";
    console.error("[Webhook] Fatal:", message);
    return NextResponse.json({ received: true, error: message });
  }
}
