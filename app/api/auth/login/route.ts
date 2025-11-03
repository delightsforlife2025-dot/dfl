import { NextRequest, NextResponse } from 'next/server';

// Demo credentials - Production'da Supabase auth kullanılabilir
const ADMIN_EMAIL = 'admin@restaurant.com';
const ADMIN_PASSWORD = 'admin123';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Basit credential kontrolü
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const response = NextResponse.json(
        { success: true, message: 'Login successful' },
        { status: 200 }
      );

      // Cookie set et (1 gün geçerli)
      // Updated for better custom domain support
      response.cookies.set('admin_token', 'authenticated', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 86400, // 1 day
        path: '/',
        // Domain will be inferred from request automatically
      });

      return response;
    }

    return NextResponse.json(
      { error: 'Geçersiz e-posta veya şifre' },
      { status: 401 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Bir hata oluştu' },
      { status: 500 }
    );
  }
}
