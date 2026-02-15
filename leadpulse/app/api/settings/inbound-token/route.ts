import crypto from 'node:crypto';
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

function makeToken() {
  return crypto.randomBytes(24).toString('hex');
}

export async function GET() {
  const supabase = await createClient();
  const { data: userData, error: authError } = await supabase.auth.getUser();
  if (authError || !userData.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data, error } = await supabase
    .from('user_settings')
    .select('inbound_token')
    .eq('owner_id', userData.user.id)
    .maybeSingle();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  if (!data) {
    const inbound_token = makeToken();
    const { data: created, error: createError } = await supabase
      .from('user_settings')
      .insert({ owner_id: userData.user.id, inbound_token })
      .select('inbound_token')
      .single();
    if (createError) return NextResponse.json({ error: createError.message }, { status: 500 });
    return NextResponse.json({ data: created });
  }

  return NextResponse.json({ data });
}

export async function POST() {
  const supabase = await createClient();
  const { data: userData, error: authError } = await supabase.auth.getUser();
  if (authError || !userData.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const inbound_token = makeToken();
  const { data, error } = await supabase
    .from('user_settings')
    .upsert({ owner_id: userData.user.id, inbound_token }, { onConflict: 'owner_id' })
    .select('inbound_token')
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}
