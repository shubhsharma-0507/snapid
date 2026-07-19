import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export default auth((req) => {
  const { pathname } = req.nextUrl;

  const token = req.auth;

  const isAuth = !!token;
  const isAdmin = token?.role === "admin";


  // Admin routes
  if (pathname.startsWith("/admin")) {

    if (!isAuth) {
      return NextResponse.redirect(
        new URL("/login", req.url)
      );
    }

    if (!isAdmin) {
      return NextResponse.redirect(
        new URL("/dashboard", req.url)
      );
    }

    return NextResponse.next();
  }


  // Protected routes
  const protectedRoutes = [
    "/dashboard",
    "/generator",
    "/history",
    "/profile",
  ];


  if (
    protectedRoutes.some((route) =>
      pathname.startsWith(route)
    )
  ) {

    if (!isAuth) {

      const loginUrl = new URL(
        "/login",
        req.url
      );

      loginUrl.searchParams.set(
        "callbackUrl",
        pathname
      );

      return NextResponse.redirect(loginUrl);
    }
  }


  // Prevent logged user from login/register
  if (
    isAuth &&
    (
      pathname === "/login" ||
      pathname === "/register"
    )
  ) {

    return NextResponse.redirect(
      new URL("/dashboard", req.url)
    );

  }


  return NextResponse.next();

});


export const config = {
  matcher: [
    "/dashboard/:path*",
    "/generator/:path*",
    "/history/:path*",
    "/profile/:path*",
    "/admin/:path*",
    "/login",
    "/register",
  ],
};