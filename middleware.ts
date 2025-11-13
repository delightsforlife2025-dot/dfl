import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('admin_token');

  // Login sayfası - token varsa dashboard'a yönlendir
  if (pathname === '/dashboard/login') {
    if (token) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    // Token yoksa login sayfasına devam et
    return NextResponse.next();
  }

  // Diğer dashboard sayfaları - token yoksa login'e yönlendir
  if (pathname.startsWith('/dashboard')) {
    if (!token) {
      return NextResponse.redirect(new URL('/dashboard/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
