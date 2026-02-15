'use client';

import { FormEvent, useState } from 'react';

export function LeadForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const form = new FormData(event.currentTarget);
    const payload = {
      full_name: form.get('full_name'),
      email: form.get('email') || null,
      phone: form.get('phone') || null,
      source: 'manual',
    };

    const response = await fetch('/api/leads', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const body = await response.json();
      setError(body.error ? JSON.stringify(body.error) : 'Request failed');
      setLoading(false);
      return;
    }

    event.currentTarget.reset();
    setLoading(false);
    window.location.reload();
  }

  return (
    <form onSubmit={onSubmit} style={{ marginBottom: 24 }}>
      <h2>Create Lead</h2>
      <input name="full_name" placeholder="Full name" required style={{ display: 'block', marginBottom: 8 }} />
      <input name="email" placeholder="Email" style={{ display: 'block', marginBottom: 8 }} />
      <input name="phone" placeholder="Phone" style={{ display: 'block', marginBottom: 8 }} />
      <button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
}
