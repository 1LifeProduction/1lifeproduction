interface Entry { count: number; resetAt: number }

const store = new Map<string, Entry>()

// Purge expired entries every 5 minutes to avoid memory leak
setInterval(() => {
  const now = Date.now()
  for (const [key, entry] of store) {
    if (now > entry.resetAt) store.delete(key)
  }
}, 5 * 60_000)

export function rateLimit(
  ip: string,
  maxRequests = 3,
  windowMs = 60_000,
): { allowed: boolean; retryAfter: number } {
  const now = Date.now()
  const entry = store.get(ip)

  if (!entry || now > entry.resetAt) {
    store.set(ip, { count: 1, resetAt: now + windowMs })
    return { allowed: true, retryAfter: 0 }
  }

  if (entry.count >= maxRequests) {
    return { allowed: false, retryAfter: Math.ceil((entry.resetAt - now) / 1000) }
  }

  entry.count++
  return { allowed: true, retryAfter: 0 }
}
