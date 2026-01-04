// llmClient.js

// React only exposes variables starting with REACT_APP_
// so we manually read the raw .env variables using import.meta.env (Vite)
// or process.env (CRA) and re-expose them.

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:4000';

export async function generateLLMResponse(prompt) {
  const res = await fetch(`${API_BASE}/api/story`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt })
  });
  const jd = await res.json();
  return jd && jd.reply ? jd.reply : '';
}
