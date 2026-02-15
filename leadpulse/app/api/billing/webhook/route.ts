import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import type Stripe from 'stripe';
import { stripe } from '@/lib/stripe';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get('stripe-signature');

  if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Missing webhook signature' }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (error) {
    return NextResponse.json({ error: `Webhook verification failed: ${(error as Error).message}` }, { status: 400 });
  }

  const admin = createAdminClient();

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const customerId = typeof session.customer === 'string' ? session.customer : null;
    const subscriptionId = typeof session.subscription === 'string' ? session.subscription : null;
    if (customerId) {
      await admin
        .from('billing_customers')
        .update({ stripe_customer_id: customerId, stripe_subscription_id: subscriptionId, billing_status: 'active' })
        .eq('stripe_customer_id', customerId);
    }
  }

  if (event.type === 'customer.subscription.updated' || event.type === 'customer.subscription.deleted') {
    const sub = event.data.object as Stripe.Subscription;
    const customerId = typeof sub.customer === 'string' ? sub.customer : null;
    if (customerId) {
      await admin
        .from('billing_customers')
        .update({
          stripe_subscription_id: sub.id,
          billing_status: (sub.status === 'active' ? 'active' : sub.status === 'past_due' ? 'past_due' : sub.status === 'trialing' ? 'trialing' : 'canceled') as
            | 'active'
            | 'past_due'
            | 'trialing'
            | 'canceled',
        })
        .eq('stripe_customer_id', customerId);
    }
  }

  return NextResponse.json({ received: true });
}
