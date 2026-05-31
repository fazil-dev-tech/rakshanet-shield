import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Naive check for Supabase auth token cookie.
  // In a full production setup with @supabase/ssr installed, this would use createServerClient
  const authCookie = request.cookies.getAll().find(c => c.name.startsWith('sb-') && c.name.endsWith('-auth-token'));
  
  const protectedPaths = ['/dashboard', '/reports', '/report', '/settings', '/analytics', '/community', '/assistant', '/threats'];
  const isProtected = protectedPaths.some(path => request.nextUrl.pathname.startsWith(path));

  if (isProtected && !authCookie) {
    // If no active session found, redirect to the main page and trigger the Auth Modal
    return NextResponse.redirect(new URL('/?auth=true', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api).*)'],
}
