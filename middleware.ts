export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/recipient/:path*",
    "/donor/:path*",
    "/mentor/:path*",
    "/admin/:path*",
  ],
};
