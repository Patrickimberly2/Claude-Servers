import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createAdminClient } from '@/lib/supabase/admin';
import { enqueueDefaultFollowUps } from '@/lib/follow-up';

const inboundSchema = z.object({
  inbound_token: z.string().min(10),
  full_name: z.string().min(2),
  email: z.string().email().optional(),
  phone: z.string().min(5).optional(),
  notes: z.string().max(2000).optional(),
  source: z.string().default('inbound_webhook'),
});

export async function POST(req: Request) {
  const json = await req.json();
  const parsed = inboundSchema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const supabase = createAdminClient();
  const { data: settings, error: settingsError } = await supabase
    .from('user_settings')
    .select('owner_id, inbound_token')
    .eq('inbound_token', parsed.data.inbound_token)
    .maybeSingle();

  if (settingsError) return NextResponse.json({ error: settingsError.message }, { status: 500 });
  if (!settings) return NextResponse.json({ error: 'Invalid inbound token' }, { status: 401 });

  const leadPayload = {
    full_name: parsed.data.full_name,
    email: parsed.data.email,
    phone: parsed.data.phone,
    notes: parsed.data.notes,
    source: parsed.data.source,
  };

  const { data: lead, error: leadError } = await supabase
    .from('leads')
    .insert({ ...leadPayload, owner_id: settings.owner_id })
    .select('*')
    .single();

  if (leadError) return NextResponse.json({ error: leadError.message }, { status: 500 });

  await enqueueDefaultFollowUps(supabase, lead);

  return NextResponse.json({ data: lead }, { status: 201 });
}
