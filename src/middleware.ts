import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ✅ Public routes (NO auth required)
 if (pathname.startsWith("/verify")) {
  const email = request.nextUrl.searchParams.get("otpemail");

  if (!email) {
    return NextResponse.redirect(new URL("/auth", request.url));
  }

  return NextResponse.next();
}


  // 🔒 Protected routes
  if (
    pathname.startsWith("/profile") ||
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/orders") ||
    pathname.startsWith("/checkout")
  ) {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token) {
      const callbackUrl = encodeURIComponent(pathname + request.nextUrl.search);
      return NextResponse.redirect(new URL(`/auth?callbackUrl=${callbackUrl}`, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/verify",
    "/profile/:path*",
    "/dashboard/:path*",
    "/orders/:path*",
    "/checkout/:path*",
  ],
};
