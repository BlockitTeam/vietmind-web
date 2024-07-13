// middleware.ts
import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const jsessionId = request.cookies.get('JSESSIONID');

  if (!jsessionId) {
    const response: any = NextResponse.redirect(new URL('/', request.url));
    // ts-ignore-next-line
    response.status = 401;
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/protected/:path*', '/another-protected-page'], // Apply middleware to specific paths
};