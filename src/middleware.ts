// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const JSESSIONID = req.cookies.get('JSESSIONID');
  const url = req.nextUrl.clone();

  // Redirect logic based on the presence of JSESSIONID cookie
  if (!JSESSIONID) {
    // If there is no JSESSIONID and the user is trying to access a protected route, redirect to login
    if (url.pathname !== '/') {
      url.pathname = '/';
      return NextResponse.redirect(url);
    }
  } else {
    // If there is a valid JSESSIONID and the user is trying to access the login page, redirect to /chat
    if (url.pathname === '/') {
      url.pathname = '/chat';
      return NextResponse.redirect(url);
    }
  }

  // Continue with the response chain
  const response = NextResponse.next();

  // Check the response status and clear cookies if 403
  response.headers.set('Cache-Control', 'no-store'); // Ensure we don't cache this check

  // If there is a 403 status, clear the JSESSIONID cookie
  if (response.status === 403) {
    console.log('Access forbidden: 403 status code detected.');
    // Clear the JSESSIONID cookies
    response.cookies.set('JSESSIONID', '', { path: '/', maxAge: 0 });

    // Redirect the user to the login page
    url.pathname = '/';
    return NextResponse.redirect(url);
  }

  return response;
}

// Apply middleware to specific routes
export const config = {
  matcher: ['/chat', '/'], // Add all the routes you want the middleware to apply to
};