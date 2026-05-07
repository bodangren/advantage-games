import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Protect teacher routes
  if (pathname.startsWith('/teacher')) {
    const token = request.cookies.get('auth-token')?.value;
    
    if (!token) {
      const loginUrl = new URL('/teacher/login', request.nextUrl.origin);
      return NextResponse.redirect(loginUrl);
    }
    
    // Simple token validation - in production, verify JWT signature
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload.role !== 'teacher') {
        return NextResponse.redirect(new URL('/', request.url));
      }
    } catch {
      const loginUrl = new URL('/teacher/login', request.nextUrl.origin);
      return NextResponse.redirect(loginUrl);
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/teacher/:path*'],
};
