import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { sendEmail, sendSms } from '@/lib/messaging';
import { shouldSkipFollowup } from '@/lib/followup-dispatch';

export async function POST(req: Request) {
  const auth = req.headers.get('authorization');
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createAdminClient();
  const now = new Date().toISOString();

  const { data: queue, error } = await supabase
    .from('follow_up_queue')
    .select('id, channel, message, lead_id, leads!inner(status, phone, email)')
    .eq('status', 'pending')
    .lte('scheduled_for', now)
    .limit(100);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const results: Array<{ id: string; status: string; error?: string }> = [];

  for (const item of queue ?? []) {
    const lead = Array.isArray(item.leads) ? item.leads[0] : item.leads;
    if (!lead || shouldSkipFollowup(lead.status)) {
      await supabase.from('follow_up_queue').update({ status: 'skipped' }).eq('id', item.id);
      results.push({ id: item.id, status: 'skipped' });
      continue;
    }

    try {
      if (item.channel === 'sms') {
        if (!lead.phone) throw new Error('Lead has no phone');
        await sendSms(lead.phone, item.message);
      } else {
        if (!lead.email) throw new Error('Lead has no email');
        await sendEmail(lead.email, item.message);
      }

      await supabase
        .from('follow_up_queue')
        .update({ status: 'sent', sent_at: new Date().toISOString() })
        .eq('id', item.id);
      results.push({ id: item.id, status: 'sent' });
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Unknown error';
      await supabase.from('follow_up_queue').update({ status: 'failed', error_message: message }).eq('id', item.id);
      results.push({ id: item.id, status: 'failed', error: message });
    }
  }

  return NextResponse.json({ data: results });
}
