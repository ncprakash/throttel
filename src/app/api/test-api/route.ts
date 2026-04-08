import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET() {
  try {
    // 1. AUTHENTICATION
    const authResponse = await axios.post('https://apiv2.shiprocket.in/v1/external/auth/login', {
      email: process.env.SHIPROCKET_EMAIL,
      password: process.env.SHIPROCKET_PASSWORD,
    });

    const TOKEN = authResponse.data.token;

    // 2. DATA PREPARATION
    const uniqueId = `ORD_${Date.now()}`;
    const cleanPhone = "8296365807"; // Using a confirmed valid number from your logs

    const dummyOrder = {
      order_id: uniqueId,
      order_date: new Date().toISOString().split('T')[0] + " 18:00",
      
      // CRITICAL FIX: Changed from "Primary" to "home" based on your API response
      pickup_location: "home", 
      
      billing_customer_name: "Prakash",
      billing_last_name: "Test",
      billing_address: "Flat 101, Tech Residency",
      billing_city: "Bangalore",
      billing_pincode: "560078",
      billing_state: "Karnataka",
      billing_country: "India",
      billing_email: "ncprakash121@gmail.com",
      billing_phone: cleanPhone,
      shipping_is_billing: true,
      order_items: [
        {
          name: "Sample Product",
          sku: "SAMPLE-001",
          units: 1,
          selling_price: "100",
        }
      ],
      payment_method: "Prepaid",
      sub_total: 100,
      length: 10,
      breadth: 10,
      height: 10,
      weight: 0.5
    };

    // 3. CREATE ORDER
    const orderResponse = await axios.post(
      'https://apiv2.shiprocket.in/v1/external/orders/create/adhoc',
      dummyOrder,
      {
        headers: {
          'Authorization': `Bearer ${TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );

    // 4. VERIFICATION LOGIC
    // Shiprocket returns a 200 even if the order fails internally, 
    // so we check for the 'order_id' in the response body.
    if (orderResponse.data.order_id) {
        return NextResponse.json({
          success: true,
          message: "ORDER CREATED! Check your Shiprocket Dashboard now.",
          order_id: orderResponse.data.order_id,
          shipment_id: orderResponse.data.shipment_id
        });
    } else {
        // This catches cases where the pickup location is still wrong
        return NextResponse.json({
          success: false,
          message: "Order was NOT created. Check location nickname.",
          shiprocket_feedback: orderResponse.data
        }, { status: 400 });
    }

  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.response?.data || error.message },
      { status: error.response?.status || 500 }
    );
  }
}