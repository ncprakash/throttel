import { NextRequest, NextResponse } from 'next/server';
import { addProduct, getAdminFromSession, listProducts, removeProduct } from '@/lib/mockStore';

function requireAdmin(request: NextRequest) {
  const token = request.cookies.get('admin-token')?.value;
  const admin = getAdminFromSession(token);

  if (!admin) {
    return null;
  }

  return admin;
}

export async function GET(request: NextRequest) {
  const admin = requireAdmin(request);
  if (!admin) {
    return NextResponse.json(
      { ok: false, error: 'Admin session required' },
      { status: 401 },
    );
  }

  return NextResponse.json({
    ok: true,
    products: listProducts(),
  });
}

export async function POST(request: NextRequest) {
  const admin = requireAdmin(request);
  if (!admin) {
    return NextResponse.json(
      { ok: false, error: 'Admin session required' },
      { status: 401 },
    );
  }

  try {
    const body = await request.json();
    const { name, description, price } = body;

    if (!name || !description || price === undefined) {
      return NextResponse.json(
        { ok: false, error: 'Name, description, and price are required' },
        { status: 400 },
      );
    }

    const numericPrice = Number(price);
    if (Number.isNaN(numericPrice) || numericPrice <= 0) {
      return NextResponse.json(
        { ok: false, error: 'Price must be a positive number' },
        { status: 400 },
      );
    }

    const product = addProduct(name, description, numericPrice);

    return NextResponse.json({
      ok: true,
      message: 'Product added successfully',
      product,
      products: listProducts(),
    });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: 'Unable to add product' },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  const admin = requireAdmin(request);
  if (!admin) {
    return NextResponse.json(
      { ok: false, error: 'Admin session required' },
      { status: 401 },
    );
  }

  try {
    const body = await request.json();
    const { productId } = body;

    if (!productId) {
      return NextResponse.json(
        { ok: false, error: 'Product id is required' },
        { status: 400 },
      );
    }

    const removed = removeProduct(productId);

    if (!removed) {
      return NextResponse.json(
        { ok: false, error: 'Product not found' },
        { status: 404 },
      );
    }

    return NextResponse.json({
      ok: true,
      message: 'Product removed',
      products: listProducts(),
    });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: 'Unable to remove product' },
      { status: 500 },
    );
  }
}

