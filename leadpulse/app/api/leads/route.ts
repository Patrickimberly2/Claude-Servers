import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { leadCreateSchema } from '@/lib/validators/leads';
import { enqueueDefaultFollowUps } from '@/lib/follow-up';

export async function GET() {
  const supabase = await createClient();
  const { data: userData, error: authError } = await supabase.auth.getUser();
  if (authError || !userData.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data, error } = await supabase.from('leads').select('*').order('created_at', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ data });
}

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: userData, error: authError } = await supabase.auth.getUser();
  if (authError || !userData.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const json = await req.json();
  const parsed = leadCreateSchema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const { data: lead, error } = await supabase.from('leads').insert(parsed.data).select('*').single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await enqueueDefaultFollowUps(supabase, lead);

  return NextResponse.json({ data: lead }, { status: 201 });
}
