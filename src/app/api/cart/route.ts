// app/api/cart/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  // Mock cart data
  const mockCartItems = {
    items: [
      {
        cart_item_id: "1",
        product: {
          product_id: "1",
          name: "Quantum-X Helmet",
          slug: "quantum-x-helmet",
          image_url: "/products/helmet.jpg",
          regular_price: 850.0,
          sale_price: null,
        },
        variant: null,
        quantity: 1,
      },
      {
        cart_item_id: "2",
        product: {
          product_id: "2",
          name: "Gridrunner Jacket",
          slug: "gridrunner-jacket",
          image_url: "/products/jacket.jpg",
          regular_price: 450.0,
          sale_price: null,
        },
        variant: {
          variant_id: "1",
          variant_name: "Black",
          color: "#000000",
          additional_price: 0,
        },
        quantity: 1,
      },
    ],
  };

  return NextResponse.json(mockCartItems);
}
