// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  // Get the authentication token (or session) from cookies
  const token = req.cookies.get("JSESSIONID");

  // Define protected paths
  const protectedPaths = ["/chat", "/appointment"];

  // Check if the request is for a protected path and the token is missing
  if (protectedPaths.includes(req.nextUrl.pathname) && !token) {
    // Redirect to the login page if not authenticated
    const loginUrl = new URL("/", req.url);
    return NextResponse.redirect(loginUrl);
  }

  // Allow the request to continue if authenticated or path isn't protected
  return NextResponse.next();
}

// Apply middleware to all routes under /chat or /appointment
export const config = {
  matcher: ["/chat/:path*", "/appointment/:path*"],
};