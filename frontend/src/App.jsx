import { useEffect, useState } from 'react';

export default function App() {
  const [health, setHealth] = useState('checking…');

  useEffect(() => {
    fetch('/api/health')
      .then((r) => r.json())
      .then((d) => setHealth(d.status ?? 'unknown'))
      .catch(() => setHealth('unreachable'));
  }, []);

  return (
    <main>
      <h1>mi.zur-i.com</h1>
      <p>Placeholder page — real content coming soon.</p>
      <p>
        Backend health: <strong>{health}</strong>
      </p>
    </main>
  );
}
