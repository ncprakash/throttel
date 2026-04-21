import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

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

export async function POST(request: NextRequest) {
  try {
    const { order_id, order_number } = await request.json();

    if (!order_id && !order_number) {
      return NextResponse.json({ error: "Provide order_id or order_number" }, { status: 400 });
    }

    // Fetch the order
    const query = supabase.from("orders").select("*, order_items(*)");
    const { data: order, error } = order_id
      ? await query.eq("order_id", order_id).single()
      : await query.eq("order_number", order_number).single();

    if (error || !order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (order.shiprocket_order_id) {
      return NextResponse.json({
        skipped: true,
        message: "ShipRocket order already exists",
        shiprocket_order_id: order.shiprocket_order_id,
      });
    }

    // Parse customer info from notes if needed (legacy fallback)
    if (!order.customer_name && order.notes) {
      try {
        const parsed = JSON.parse(order.notes);
        Object.assign(order, parsed);
      } catch { /* not JSON */ }
    }

    const rawPhone = order.customer_phone || "";
    const cleanPhone = rawPhone.replace(/\D/g, "").replace(/^91/, "").slice(-10);
    if (cleanPhone.length !== 10) {
      return NextResponse.json({ error: `Invalid phone: "${rawPhone}"` }, { status: 400 });
    }

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

    const now = new Date();
    const orderDate = `${now.toISOString().split("T")[0]} ${now.getHours()}:${String(now.getMinutes()).padStart(2, "0")}`;

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

    const token = await getShipRocketToken();
    const srRes = await fetch("https://apiv2.shiprocket.in/v1/external/orders/create/adhoc", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload),
    });

    const srData = await srRes.json();

    if (!srRes.ok || !srData.order_id) {
      return NextResponse.json({ error: "ShipRocket failed", details: srData }, { status: 500 });
    }

    const shiprocket_order_id = String(srData.order_id);
    await supabase
      .from("orders")
      .update({ shiprocket_order_id, status: "confirmed", payment_status: "paid" })
      .eq("order_id", order.order_id);

    return NextResponse.json({
      success: true,
      shiprocket_order_id,
      shiprocket_response: srData,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
