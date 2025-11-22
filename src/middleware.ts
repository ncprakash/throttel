// middleware.ts
export { default } from "next-auth/middleware";

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
