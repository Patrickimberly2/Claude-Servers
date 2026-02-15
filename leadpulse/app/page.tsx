import Link from 'next/link';
import { LeadForm } from '@/components/lead-form';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  const { data: leads } = userData.user
    ? await supabase.from('leads').select('*').order('created_at', { ascending: false }).limit(50)
    : { data: [] as never[] };

  return (
    <main style={{ padding: 24, fontFamily: 'sans-serif' }}>
      <h1>LeadPulse MVP</h1>
      <p>
        <Link href="/settings">Settings</Link> · <Link href="/billing">Billing</Link>
      </p>
      <LeadForm />
      <h2>Recent Leads</h2>
      <ul>
        {(leads ?? []).map((lead) => (
          <li key={lead.id}>
            {lead.full_name} — {lead.status} — {lead.email ?? lead.phone ?? 'No contact'}
          </li>
        ))}
      </ul>
    </main>
  );
}
