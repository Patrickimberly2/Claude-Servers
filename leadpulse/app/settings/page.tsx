'use client';

import { useEffect, useState } from 'react';

export default function SettingsPage() {
  const [token, setToken] = useState<string>('');

  async function rotate() {
    const res = await fetch('/api/settings/inbound-token', { method: 'POST' });
    const body = await res.json();
    setToken(body.data?.inbound_token ?? '');
  }

  useEffect(() => {
    fetch('/api/settings/inbound-token')
      .then((res) => res.json())
      .then((body) => setToken(body.data?.inbound_token ?? ''));
  }, []);

  return (
    <main style={{ padding: 24, fontFamily: 'sans-serif' }}>
      <h1>Settings</h1>
      <p>Inbound token for webhook validation:</p>
      <code>{token || 'Loading...'}</code>
      <div style={{ marginTop: 16 }}>
        <button onClick={rotate}>Rotate token</button>
      </div>
    </main>
  );
}
