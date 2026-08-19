import { kv } from '@vercel/kv';

interface RateLimitResult {
  success: boolean;
  error?: string;
  retryAfter?: number;
}

const KV_ENABLED = !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);

// In-memory fallback for local dev / when KV is not configured.
// Note: resets on process restart and is not shared across serverless instances.
const memStore = new Map<string, { count: number; expires: number }>();

function memIncr(key: string, ttlSec: number): number {
  const now = Date.now();
  const entry = memStore.get(key);
  if (!entry || entry.expires < now) {
    memStore.set(key, { count: 1, expires: now + ttlSec * 1000 });
    // Periodically clean up expired entries to prevent memory growth
    if (memStore.size > 5000) {
      for (const [k, v] of memStore) {
        if (v.expires < now) memStore.delete(k);
      }
    }
    return 1;
  }
  entry.count++;
  return entry.count;
}

async function kvIncr(key: string, ttlSec: number): Promise<number> {
  const count = await kv.incr(key);
  if (count === 1) await kv.expire(key, ttlSec);
  return count;
}

export async function rateLimit(clientId: string, ip: string): Promise<RateLimitResult> {
  try {
    const minKey  = `rl:${clientId}:${ip}:min`;
    const hourKey = `rl:${clientId}:${ip}:hour`;

    const minCount  = KV_ENABLED ? await kvIncr(minKey, 60)     : memIncr(minKey, 60);
    if (minCount > 8) {
      return { success: false, error: 'Too many messages. Please wait a moment.', retryAfter: 60 };
    }

    const hourCount = KV_ENABLED ? await kvIncr(hourKey, 3600) : memIncr(hourKey, 3600);
    if (hourCount > 40) {
      return { success: false, error: 'Hourly limit reached. Try again later.', retryAfter: 3600 };
    }

    return { success: true };
  } catch {
    // On storage errors fail open — don't block legitimate users
    return { success: true };
  }
}

// Simpler limit for booking endpoints (stricter: 5/min per IP)
export async function rateLimitBook(ip: string): Promise<RateLimitResult> {
  try {
    const key = `rl:book:${ip}:min`;
    const count = KV_ENABLED ? await kvIncr(key, 60) : memIncr(key, 60);
    if (count > 5) {
      return { success: false, error: 'Too many booking requests. Please wait a moment.', retryAfter: 60 };
    }
    return { success: true };
  } catch {
    return { success: true };
  }
}
