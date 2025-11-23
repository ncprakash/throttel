import type { NextRequestWithAuth } from "next-auth/middleware";
import nextAuthMiddleware from "next-auth/middleware";

export function middleware(request: NextRequestWithAuth) {
  return nextAuthMiddleware(request);
}

export const config = {
  matcher: [
    "/:nextData(_next/data/[^/]+)?/admin(.*)?(\\.json)?",
    "/verify",
    "/checkout",
    "/orders/:path*",
    "/profile",
    "/dashboard/:path*",
  ],
};
