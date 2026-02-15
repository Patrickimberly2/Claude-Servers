'use client';

export default function BillingPage() {
  async function checkout() {
    const res = await fetch('/api/billing/checkout', { method: 'POST' });
    const body = await res.json();
    if (body.data?.url) window.location.href = body.data.url;
  }

  return (
    <main style={{ padding: 24, fontFamily: 'sans-serif' }}>
      <h1>Billing</h1>
      <p>Subscribe to LeadPulse Pro.</p>
      <button onClick={checkout}>Checkout</button>
    </main>
  );
}
