// lib/validation.ts
// Input validation & sanitization utilities

// ── Email ────────────────────────────────────────────────────────────────────
export function isValidEmail(email: string): boolean {
  return /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/.test(email.trim());
}

// ── Password strength ────────────────────────────────────────────────────────
export interface PasswordCheck {
  valid: boolean;
  message: string;
}

export function validatePassword(password: string): PasswordCheck {
  if (password.length < 8)
    return { valid: false, message: 'Password must be at least 8 characters' };
  if (!/[A-Z]/.test(password))
    return { valid: false, message: 'Password must contain at least one uppercase letter' };
  if (!/[0-9]/.test(password))
    return { valid: false, message: 'Password must contain at least one number' };
  if (!/[^a-zA-Z0-9]/.test(password))
    return { valid: false, message: 'Password must contain at least one special character' };
  return { valid: true, message: 'Strong' };
}

// ── Name sanitization ────────────────────────────────────────────────────────
export function sanitizeName(name: string): string {
  // Remove HTML tags, trim, collapse whitespace
  return name
    .replace(/<[^>]*>/g, '')          // strip HTML
    .replace(/[<>"'`]/g, '')          // strip XSS chars
    .replace(/\s+/g, ' ')             // collapse whitespace
    .trim()
    .slice(0, 100);                   // max 100 chars
}

// ── Generic string sanitize ──────────────────────────────────────────────────
export function sanitizeString(input: string, maxLen = 500): string {
  return input
    .replace(/<[^>]*>/g, '')
    .replace(/[<>"'`]/g, '')
    .trim()
    .slice(0, maxLen);
}

// ── Mongo ObjectId check ─────────────────────────────────────────────────────
export function isValidObjectId(id: string): boolean {
  return /^[a-f\d]{24}$/i.test(id);
}

// ── Base64 image check ───────────────────────────────────────────────────────
export function isValidBase64Image(data: string): { valid: boolean; mimeType?: string } {
  const match = data.match(/^data:(image\/(jpeg|jpg|png|webp));base64,/);
  if (!match) return { valid: false };
  const base64 = data.split(',')[1];
  // Rough size check — 10MB max in base64
  if (base64.length > 10 * 1024 * 1024 * 1.37) return { valid: false };
  return { valid: true, mimeType: match[1] };
}

// ── IP from request ──────────────────────────────────────────────────────────
export function getClientIP(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return req.headers.get('x-real-ip') || 'unknown';
}

// ── Rate limiting (in-memory) ────────────────────────────────────────────────
interface RateLimitOptions {
  limit: number;      // max requests
  windowMs: number;   // time window in ms
}

interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetAt: number;
}

const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(key: string, options: RateLimitOptions): RateLimitResult {
  const now = Date.now();
  const entry = rateLimitStore.get(key);

  if (!entry || now > entry.resetAt) {
    const resetAt = now + options.windowMs;
    rateLimitStore.set(key, { count: 1, resetAt });
    return { success: true, remaining: options.limit - 1, resetAt };
  }

  if (entry.count >= options.limit) {
    return { success: false, remaining: 0, resetAt: entry.resetAt };
  }

  entry.count += 1;
  rateLimitStore.set(key, entry);
  return { success: true, remaining: options.limit - entry.count, resetAt: entry.resetAt };
}