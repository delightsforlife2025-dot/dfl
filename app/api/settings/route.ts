import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseServer';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { key, value } = body;

    // Basic validation
    if (!key || value === undefined) {
      return NextResponse.json(
        { error: 'key and value are required' },
        { status: 400 }
      );
    }

    // Use admin client (service role) to bypass RLS
    const { error } = await supabaseAdmin
      .from('site_settings')
      .upsert({ key, value }, { onConflict: 'key' });

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to save settings' },
        { status: 500 }
      );
    }

    console.log('Settings saved:', key);

    return NextResponse.json(
      { success: true, message: 'Settings saved successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Settings API error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

