import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { processConfirmedPayment } from "@/lib/shiprocket";

/**
 * POST /api/admin/orders/shiprocket-sync
 * Body: { order_id } | { order_number }
 * Manually (re)sync a paid order to ShipRocket.
 */
export async function POST(request: NextRequest) {
  try {
    const { order_id, order_number } = await request.json();

    if (!order_id && !order_number) {
      return NextResponse.json({ error: "Provide order_id or order_number" }, { status: 400 });
    }

    const q = supabase.from("orders").select("order_id, payment_status, shiprocket_order_id, razorpay_payment_id");
    const { data: order, error } = order_id
      ? await q.eq("order_id", order_id).single()
      : await q.eq("order_number", order_number).single();

    if (error || !order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (order.payment_status !== "paid") {
      return NextResponse.json({ error: "Order is not paid yet", status: order.payment_status }, { status: 400 });
    }

    if (order.shiprocket_order_id) {
      return NextResponse.json({
        skipped: true,
        message: "ShipRocket order already exists",
        shiprocket_order_id: order.shiprocket_order_id,
      });
    }

    const { shiprocketOrderId, shiprocketError } = await processConfirmedPayment(
      order.order_id,
      order.razorpay_payment_id || "manual-sync"
    );

    if (shiprocketError) {
      return NextResponse.json({ success: false, error: shiprocketError }, { status: 500 });
    }

    return NextResponse.json({ success: true, shiprocket_order_id: shiprocketOrderId });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * GET /api/admin/orders/shiprocket-sync
 * Returns all paid orders where ShipRocket sync failed (missing shiprocket_order_id).
 */
export async function GET() {
  try {
    const { data, error } = await supabase
      .from("orders")
      .select("order_id, order_number, customer_name, customer_email, total_amount, shiprocket_error, created_at")
      .eq("payment_status", "paid")
      .is("shiprocket_order_id", null)
      .order("created_at", { ascending: false });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ unsynced_orders: data ?? [], count: (data ?? []).length });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
