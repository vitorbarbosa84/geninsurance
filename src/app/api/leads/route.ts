import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
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
    // This line fixes the "unused variable" error
    console.error('Failed to submit lead:', error); 
    return NextResponse.json({ error: 'Failed to submit lead' }, { status: 500 });
  }
}