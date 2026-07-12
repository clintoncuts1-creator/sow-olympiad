import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect /admin and /host routes
  if (pathname.startsWith('/admin') || pathname.startsWith('/host')) {
    // Allow access to login pages
    if (pathname === '/admin/login' || pathname === '/host/login') {
      return NextResponse.next();
    }

    // Check for valid session cookie
    const sessionToken = request.cookies.get('admin_session')?.value;

    if (!sessionToken) {
      // Redirect to login page based on route
      const loginPath = pathname.startsWith('/admin') ? '/admin/login' : '/host/login';
      return NextResponse.redirect(new URL(loginPath, request.url));
    }

    // Verify token format (basic check - format should be valid JWT)
    const parts = sessionToken.split('.');
    if (parts.length !== 3) {
      // Invalid token format, redirect to login
      const loginPath = pathname.startsWith('/admin') ? '/admin/login' : '/host/login';
      return NextResponse.redirect(new URL(loginPath, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/host/:path*'],
};
