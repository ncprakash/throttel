import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import crypto from "crypto";
import { supabase } from "@/lib/supabase";
import nodemailer from "nodemailer";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

const createTransport = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

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
      // Fetch order details from Supabase
      const { data: order, error: fetchError } = await supabase
        .from("orders")
        .select("*, user:users(email, name), order_items(*, products(name, price, image_url))")
        .eq("order_id", order_id)
        .single();

      if (fetchError || !order) {
        return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
      }

      // Update order status
      const { error: updateError } = await supabase
        .from("orders")
        .update({ 
          status: "confirmed", 
          payment_status: "paid",
          razorpay_payment_id 
        })
        .eq("order_id", order_id);

      if (updateError) {
        console.error("Order update error:", updateError);
      }

      // Send order confirmation email
      const transporter = createTransport();
      
      const totalAmount = order.order_items.reduce((sum: number, item: any) => sum + (item.quantity * item.products.price), 0);
      
      await transporter.sendMail({
        from: `"Throttle Forged Customs" <${process.env.SMTP_USER}>`,
        to: order.user.email,
        subject: `Order #${order_id} Confirmed! 🏍️`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
            <h1 style="color: #000; font-size: 28px; font-weight: bold; text-align: center;">
              Order Confirmed! 🎉
            </h1>
            <div style="background: #f8f9fa; padding: 20px; border-radius: 12px; margin: 20px 0;">
              <h2 style="color: #000; margin-top: 0;">Order #${order_id}</h2>
              <p><strong>Hey ${order.user.name || 'Rider'},</strong></p>
              <p>Your order has been confirmed and is being prepared for shipping!</p>
            </div>

            <div style="background: white; padding: 24px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); margin: 20px 0;">
              <h3 style="color: #000; margin-top: 0;">Order Details</h3>
              <table style="width: 100%; border-collapse: collapse;">
                ${order.order_items.map((item: any) => `
                  <tr style="border-bottom: 1px solid #eee; padding: 12px 0;">
                    <td style="width: 60px;">
                      <img src="${item.products.image_url}" alt="${item.products.name}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 8px;">
                    </td>
                    <td style="padding-left: 12px;">
                      <strong>${item.products.name}</strong><br>
                      <small>Qty: ${item.quantity} × ₹${item.products.price}</small>
                    </td>
                    <td style="text-align: right; font-weight: bold;">
                      ₹${item.quantity * item.products.price}
                    </td>
                  </tr>
                `).join('')}
                <tr style="border-top: 2px solid #000; margin-top: 12px;">
                  <td colspan="2" style="text-align: right; padding-top: 12px; font-weight: bold;">
                    Total Amount:
                  </td>
                  <td style="text-align: right; font-size: 20px; color: #000; font-weight: bold;">
                    ₹${totalAmount}
                  </td>
                </tr>
              </table>
            </div>

            <div style="background: #e3f2fd; padding: 20px; border-radius: 12px; margin: 24px 0;">
              <h3 style="color: #1976d2; margin-top: 0;">📦 Next Steps</h3>
              <ul style="color: #333; padding-left: 20px; margin: 0;">
                <li>✅ Payment verified (Razorpay ID: ${razorpay_payment_id})</li>
                <li>🔧 Order being prepared</li>
                <li>🚚 Shipping within 2-3 business days</li>
                <li>📱 Track your order in <strong>My Orders</strong></li>
              </ul>
            </div>

            <hr style="border: 1px solid #eee; margin: 30px 0;">
            <p style="color: #666; text-align: center;">
              Need help? <a href="mailto:support@throttleforged.com" style="color: #000;">Contact Support</a>
            </p>
            <p style="color: #888; font-size: 12px; text-align: center;">
              Throttle Forged Customs | <a href="/privacy">Privacy Policy</a>
            </p>
          </div>
        `,
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, error: "Invalid signature" }, { status: 400 });
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json({ success: false, error: "Verification failed" }, { status: 500 });
  }
}
