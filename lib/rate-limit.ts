// lib/rate-limit.ts
// In-memory rate limiter — no external dependency needed

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

// Global store (survives across requests in same process)
const store = new Map<string, RateLimitEntry>();

// Clean expired entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store.entries()) {
    if (entry.resetAt < now) store.delete(key);
  }
}, 5 * 60 * 1000);

interface RateLimitOptions {
  limit: number;      // max requests
  windowMs: number;   // time window in ms
}

export function rateLimit(
  identifier: string,
  options: RateLimitOptions
): { success: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const key = identifier;

  const entry = store.get(key);

  if (!entry || entry.resetAt < now) {
    // Fresh window
    store.set(key, { count: 1, resetAt: now + options.windowMs });
    return { success: true, remaining: options.limit - 1, resetAt: now + options.windowMs };
  }

  if (entry.count >= options.limit) {
    return { success: false, remaining: 0, resetAt: entry.resetAt };
  }

  entry.count++;
  return { success: true, remaining: options.limit - entry.count, resetAt: entry.resetAt };
}

// Helpers for common limits
export const limits = {
  auth:       { limit: 5,   windowMs: 15 * 60 * 1000 }, // 5 attempts / 15 min
  register:   { limit: 3,   windowMs: 60 * 60 * 1000 }, // 3 registrations / hour
  api:        { limit: 20,  windowMs: 60 * 1000       }, // 20 calls / min
  removeBg:   { limit: 10,  windowMs: 60 * 60 * 1000 }, // 10 bg removals / hour
  save:       { limit: 30,  windowMs: 60 * 60 * 1000 }, // 30 saves / hour
};