// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  // Get the authentication token from cookies
  const token = req.cookies.get("JSESSIONID");

  // Define protected paths
  const protectedPaths = ["/chat", "/appointment"];

  // Check if the request is for a protected path and the token is missing
  if (protectedPaths.includes(req.nextUrl.pathname) && !token) {
    // Redirect to the login page if not authenticated
    const loginUrl = new URL("/", req.url);
    return NextResponse.redirect(loginUrl);
  }

  // If the user is authenticated and trying to access the login page, redirect them to /chat
  if (token && req.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/chat", req.url));
  }

  if (token && req.nextUrl.pathname === "/login") {
    return NextResponse.redirect(new URL("/chat", req.url));
  }

  // Allow the request to proceed if authenticated or not accessing protected paths
  return NextResponse.next();
}

// Apply middleware to the root, /chat, and /appointment paths
export const config = {
  matcher: ["/", "/login" ,"/chat/:path*", "/appointment/:path*"],
};
