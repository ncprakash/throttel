// app/api/orders/verify-payment/route.ts
import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import crypto from "crypto";
import { supabase } from "@/lib/supabase";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(request: NextRequest) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      order_id,
    } = await request.json();

    // Verify signature
    const sign = razorpay_payment_id + "|" + razorpay_order_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(sign.toString())
      .digest("hex");

    if (expectedSign === razorpay_signature) {
      // Update order status
      await supabase
        .from("orders")
        .update({ 
          status: "confirmed", 
          payment_status: "paid",
          razorpay_payment_id 
        })
        .eq("order_id", order_id);

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, error: "Invalid signature" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Verification failed" }, { status: 500 });
  }
}
