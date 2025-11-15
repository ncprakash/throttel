// app/api/products/[slug]/route.ts
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;

  // Mock product data
  const mockProduct = {
    product_id: "1",
    name: "Akrapovič Slip-On Line (Titanium)",
    slug: slug,
    sku: "S-Y7SO2-HAPT",
    description: `The Slip-On Line represents the first step in the exhaust system tuning process, and it offers a great balance between price and performance.

Change the nature of your bike by adding more power, improved performance, and the unique Akrapovič sound. Everything packed in a beautifully designed Slip-on exhaust systems.

The result of taking design very seriously is a beautifully crafted exhaust system with a titanium muffler outer sleeve and plenty of carbon fibre parts. Race-proven materials.`,
    short_description: "Premium titanium slip-on exhaust system with enhanced performance and signature Akrapovič sound.",
    regular_price: 999.99,
    sale_price: 849.99,
    stock_quantity: 15,
    warranty_months: 24,
    material: "High-Grade Titanium & Carbon Fiber",
    weight: 3.8,
    fitment_guide: "Professional installation recommended. Fits 2020-2025 Royal Enfield Himalayan 450 models.",
    is_active: true,
    is_featured: true,
    images: [
      {
        image_id: "1",
        image_url: "/products/exhaust1.jpg",
        alt_text: "Akrapovič Exhaust Front View",
        is_primary: true,
      },
      {
        image_id: "2",
        image_url: "/products/exhaust2.jpg",
        alt_text: "Akrapovič Exhaust Side View",
        is_primary: false,
      },
      {
        image_id: "3",
        image_url: "/products/exhaust3.jpg",
        alt_text: "Akrapovič Exhaust Detail",
        is_primary: false,
      },
    ],
    variants: [
      {
        variant_id: "1",
        variant_name: "Titanium Silver",
        color: "#C0C0C0",
        additional_price: 0,
        stock_quantity: 10,
        is_active: true,
      },
      {
        variant_id: "2",
        variant_name: "Carbon Black",
        color: "#1a1a1a",
        additional_price: 150,
        stock_quantity: 5,
        is_active: true,
      },
    ],
  };

  return NextResponse.json(mockProduct);
}
