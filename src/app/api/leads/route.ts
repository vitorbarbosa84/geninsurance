import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// NOTE: This uses a secret key and should only run on the server.
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! 
);

export async function POST(request: Request) {
  try {
    const leadData = await request.json();
    const { data, error } = await supabase.from('leads').insert(leadData).select().single();

    if (error) { throw error; }

    return NextResponse.json({ success: true, leadId: data.id });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to submit lead' }, { status: 500 });
  }
}