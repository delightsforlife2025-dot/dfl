import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'E-posta ve şifre gereklidir' },
        { status: 400 }
      );
    }

    // Check default credentials from environment first
    const defaultEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
    const defaultPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

    if (defaultEmail && defaultPassword && email === defaultEmail && password === defaultPassword) {
      // Default credentials match
      const response = NextResponse.json(
        { success: true, message: 'Login successful' },
        { status: 200 }
      );

      response.cookies.set('admin_token', 'authenticated', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 86400,
        path: '/',
      });

      return response;
    }

    // Try to sign in with Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.session) {
      console.error('Supabase auth error:', error?.message || 'Unknown error');
      return NextResponse.json(
        { error: 'Geçersiz e-posta veya şifre' },
        { status: 401 }
      );
    }

    // Create response with success
    const response = NextResponse.json(
      { success: true, message: 'Login successful' },
      { status: 200 }
    );

    // Set auth token cookie
    response.cookies.set('admin_token', 'authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 86400,
      path: '/',
    });

    // Set session token
    if (data.session?.access_token) {
      response.cookies.set('sb-access-token', data.session.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 86400,
        path: '/',
      });
    }

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Bir hata oluştu' },
      { status: 500 }
    );
  }
}
