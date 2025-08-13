export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/streak",
    "/mentor/:path*",
    "/admin/:path*",
  ],
};
