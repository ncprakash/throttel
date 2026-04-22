import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { supabase } from "@/lib/supabase";
import { processConfirmedPayment } from "@/lib/shiprocket";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, order_id } = body;

    // Verify Razorpay signature
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(sign)
      .digest("hex");

    if (expectedSign !== razorpay_signature) {
      return NextResponse.json({ success: false, error: "Invalid signature" }, { status: 400 });
    }

    // Check order exists
    const { data: existing, error: fetchError } = await supabase
      .from("orders")
      .select("order_id, payment_status")
      .eq("order_id", order_id)
      .single();

    if (fetchError || !existing) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
    }

    // Idempotent: if already paid, skip re-processing
    if (existing.payment_status === "paid") {
      const { data: paid } = await supabase
        .from("orders")
        .select("shiprocket_order_id")
        .eq("order_id", order_id)
        .single();
      return NextResponse.json({ success: true, shiprocket_order_id: paid?.shiprocket_order_id ?? null });
    }

    const { shiprocketOrderId, shiprocketError } = await processConfirmedPayment(
      order_id,
      razorpay_payment_id
    );

    return NextResponse.json({
      success: true,
      shiprocket_order_id: shiprocketOrderId,
      shiprocket_error: shiprocketError,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Verification failed";
    console.error("[verify-payment] Fatal error:", message);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
