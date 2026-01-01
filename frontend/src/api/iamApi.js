// iamApi.js is a tiny helper for talking to the FastAPI backend.
// We keep API calls here so pages/components stay easy to read.

const API_BASE = 'http://127.0.0.1:8000'

export async function fetchIdentityBundle(query, rangeKey) {
  // Build a URL like: /api/identity?query=Rohan%20Patil&range=7d
  const rangePart = rangeKey ? `&range=${encodeURIComponent(rangeKey)}` : ''
  const url = `${API_BASE}/api/identity?query=${encodeURIComponent(query)}${rangePart}`
  const res = await fetch(url)

  if (!res.ok) {
    // If the backend returns 404 or any error, we throw.
    // DashboardPage will catch it and show a friendly message.
    const text = await res.text()
    throw new Error(text || 'Request failed')
  }

  return res.json()
}
