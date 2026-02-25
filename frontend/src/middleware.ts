import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // Define public routes that don't require authentication
  const publicRoutes = ['/', '/login', '/register', '/admin'];
  const pathname = request.nextUrl.pathname;

  const isPublicRoute = publicRoutes.includes(pathname);

  // Get token from cookies (which is set alongside localStorage)
  const token = request.cookies.get('access_token')?.value;

  // If it's a public route, allow access without redirecting
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // For protected routes (like /dashboard)
  if (!token) {
    // If no token, redirect to login
    const redirectUrl = new URL('/login', request.url);
    redirectUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // If user is logged in and accesses protected route, allow it
  return NextResponse.next();
}

// Apply middleware to all routes except static assets and API routes
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};