import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// In Next.js 16+, this MUST be named "proxy" instead of "middleware"
export function proxy(request: NextRequest) {
  const token = request.cookies.get('qd_access_token')?.value;
  const isAuthenticated = Boolean(token && token.trim().length > 0);
  const { pathname } = request.nextUrl;

  const isAuthRoute = pathname.startsWith('/login') || 
                      pathname.startsWith('/register') || 
                      pathname.startsWith('/forgot-password') ||
                      pathname.startsWith('/reset-password');

  // If NOT authenticated and trying to access the dashboard, kick to login
  if (!isAuthenticated && !isAuthRoute) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If authenticated and trying to access auth pages, kick to dashboard
  if (isAuthenticated && isAuthRoute) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
