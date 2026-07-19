import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;


const token = await getToken({
  req,
  secret: process.env.NEXTAUTH_SECRET,
  secureCookie: req.nextUrl.protocol === 'https:',
});
  const isAuth  = !token;
  const isAdmin = token?.role === 'admin';

  // Admin routes
  if (pathname.startsWith('/admin')) {
    if (!isAuth)  return NextResponse.redirect(new URL('/login', req.nextUrl.origin));
    if (!isAdmin) return NextResponse.redirect(new URL('/dashboard', req.nextUrl.origin));
    return NextResponse.next();
  }

  // Protected routes
  const protectedPaths = ['/dashboard', '/generator', '/history', '/profile'];
  if (protectedPaths.some(p => pathname.startsWith(p))) {
    if (!isAuth) {
      const loginUrl = new URL('/login', req.nextUrl.origin);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Redirect logged-in away from auth pages
  if (isAuth && (pathname === '/login' || pathname === '/register')) {
    return NextResponse.redirect(new URL('/dashboard', req.nextUrl.origin));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/generator/:path*',
    '/history/:path*',
    '/profile/:path*',
    '/admin/:path*',
    '/login',
    '/register',
  ],
};