// app/api/orders/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

function generateOrderNumber() {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `ORD-${timestamp}-${random}`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    console.log("=== Creating Order ===");
    console.log("Request body:", JSON.stringify(body, null, 2));

    const {
      user_id, // ✅ Receive user_id from frontend
      customer_name,
      customer_email,
      customer_phone,
      shipping_address,
      shipping_city,
      shipping_state,
      shipping_postal_code,
      shipping_country,
      payment_method,
      shipping_method,
      items,
      subtotal,
      shipping_cost,
      total_amount,
    } = body;

    // Validate required fields
    if (!customer_email || !customer_name) {
      return NextResponse.json(
        { error: "Customer name and email are required" },
        { status: 400 }
      );
    }

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: "Order must contain at least one item" },
        { status: 400 }
      );
    }

    const orderNumber = generateOrderNumber();

    console.log("Generated order number:", orderNumber);
    console.log("User ID:", user_id);

    // Build notes
    const notesContent = [
      `Customer: ${customer_name}`,
      `Email: ${customer_email}`,
      customer_phone ? `Phone: ${customer_phone}` : null,
      shipping_address ? `Address: ${shipping_address}` : null,
      shipping_city ? `City: ${shipping_city}` : null,
      shipping_state ? `State: ${shipping_state}` : null,
      shipping_postal_code ? `Postal Code: ${shipping_postal_code}` : null,
      shipping_country ? `Country: ${shipping_country}` : null,
    ].filter(Boolean).join(', ');

    // ✅ Create order with user_id
    const orderData: any = {
      order_number: orderNumber,
      user_id: user_id || null, // ✅ Include user_id
      status: "pending",
      payment_method: payment_method || "cod",
      payment_status: "pending",
      subtotal: Number(subtotal) || 0,
      shipping_charges: Number(shipping_cost) || 0,
      tax_amount: null,
      discount_amount: 0,
      total_amount: Number(total_amount) || 0,
      notes: notesContent,
      cancellation_reason: null,
      cancelled_at: null,
      // For now, set address IDs as null (you can create address records separately)
      shipping_address_id: null,
      billing_address_id: null,
    };

    console.log("Order data to insert:", orderData);

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert(orderData)
      .select()
      .single();

    if (orderError) {
      console.error("❌ Order creation failed:", orderError);
      return NextResponse.json(
        { 
          error: "Failed to create order", 
          details: orderError.message 
        },
        { status: 500 }
      );
    }

    console.log("✅ Order created:", order.order_id);

    // Create order items
    const orderItems = items.map((item: any) => {
      const productPrice = item.product?.sale_price ?? item.product?.regular_price ?? 0;
      const variantPrice = item.variant?.additional_price || 0;
      const unitPrice = productPrice + variantPrice;
      const totalPrice = unitPrice * item.quantity;

      return {
        order_id: order.order_id,
        product_id: item.product_id || null,
        variant_id: item.variant_id || null,
        product_name: item.product?.name || "Unknown Product",
        variant_name: item.variant?.name || null,
        quantity: Number(item.quantity) || 1,
        unit_price: Number(unitPrice) || 0,
        total_price: Number(totalPrice) || 0,
      };
    });

    const { data: orderItemsData, error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItems)
      .select();

    if (itemsError) {
      console.error("❌ Order items creation failed:", itemsError);
      await supabase.from("orders").delete().eq("order_id", order.order_id);
      
      return NextResponse.json(
        { error: "Failed to create order items", details: itemsError.message },
        { status: 500 }
      );
    }

    console.log("✅ Order items created:", orderItemsData.length);

    return NextResponse.json(
      {
        success: true,
        order: {
          ...order,
          items: orderItemsData,
        },
        message: "Order placed successfully",
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("❌ Order creation error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create order" },
      { status: 500 }
    );
  }
}
