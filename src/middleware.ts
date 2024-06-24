// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const JSESSIONID = req.cookies.get('JSESSIONID')?.value;

  if (!JSESSIONID) {
    // If there is no JSESSIONID and the user is trying to access a protected route, redirect to login
    if (req.nextUrl.pathname !== '/') {
      return NextResponse.redirect(new URL('/', req.url));
    }
  } else {
    // If there is a valid JSESSIONID and the user is trying to access the login page, redirect to /chat
    if (req.nextUrl.pathname === '/') {
      return NextResponse.redirect(new URL('/chat', req.url));
    }
  }

  return NextResponse.next();
}

// Apply middleware to specific routes
export const config = {
  matcher: ["/chat", "/"], // Add all the routes you want the middleware to apply to
};
