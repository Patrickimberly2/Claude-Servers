import type { SupabaseClient } from '@supabase/supabase-js';

export async function enqueueDefaultFollowUps(supabase: SupabaseClient, lead: { id: string; full_name: string }) {
  const now = new Date();
  const smsDate = new Date(now.getTime() + 30 * 60 * 1000);
  const emailDate = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  const items = [
    {
      lead_id: lead.id,
      channel: 'sms',
      scheduled_for: smsDate.toISOString(),
      message: `Hi ${lead.full_name}, thanks for connecting with LeadPulse. Reply if you'd like to chat today.`,
    },
    {
      lead_id: lead.id,
      channel: 'email',
      scheduled_for: emailDate.toISOString(),
      message: `Hi ${lead.full_name},\n\nThanks for your interest. We'd love to schedule a quick call.`,
    },
  ];

  const { error } = await supabase.from('follow_up_queue').insert(items);
  if (error) throw error;
}
