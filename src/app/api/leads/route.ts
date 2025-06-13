import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Use the public anon key, just like in the frontend code
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! 
);

export async function POST(request: Request) {
  try {
    const leadData = await request.json();
    const { data, error } = await supabase.from('leads').insert(leadData).select().single();

    if (error) {
      console.error('Error inserting lead:', error);
      throw error;
    }

    return NextResponse.json({ success: true, leadId: data.id });
  } catch (error) {
    console.error('Failed to submit lead:', error);
    return NextResponse.json({ error: 'Failed to submit lead' }, { status: 500 });
  }
}