import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { stripe } from '@/lib/stripe';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST() {
  const supabase = await createClient();
  const { data: userData, error: authError } = await supabase.auth.getUser();
  if (authError || !userData.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const admin = createAdminClient();
  const { data: existingRow } = await admin
    .from('billing_customers')
    .select('stripe_customer_id')
    .eq('owner_id', userData.user.id)
    .maybeSingle();

  const existing = existingRow as { stripe_customer_id: string | null } | null;
  let customerId = existing?.stripe_customer_id || null;
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: userData.user.email,
      metadata: { owner_id: userData.user.id },
    });
    customerId = customer.id;
    await admin.from('billing_customers').upsert({ owner_id: userData.user.id, stripe_customer_id: customerId });
  }

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    customer: customerId,
    line_items: [{ price: process.env.STRIPE_PRICE_ID!, quantity: 1 }],
    success_url: process.env.STRIPE_SUCCESS_URL!,
    cancel_url: process.env.STRIPE_CANCEL_URL!,
  });

  return NextResponse.json({ data: { url: session.url } });
}
