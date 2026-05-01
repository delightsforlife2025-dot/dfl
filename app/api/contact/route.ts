import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseServer';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    // Basic validation
    if (!email || !message) {
      return NextResponse.json(
        { error: 'Email and message are required' },
        { status: 400 }
      );
    }

    // Get user IP and user agent
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip');
    const userAgent = request.headers.get('user-agent');

    // Store in Supabase
    const { data, error } = await supabaseAdmin
      .from('contact_messages')
      .insert([
        {
          name: name || null,
          email,
          subject: subject || null,
          message,
          ip,
          user_agent: userAgent,
          handled: false
        }
      ])
      .select();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to save message' },
        { status: 500 }
      );
    }

    console.log('Contact form submission saved:', data);

    // TODO: Send notification email (optional)

    return NextResponse.json(
      { success: true, message: 'Message received successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
