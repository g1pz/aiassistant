import { kv } from '@vercel/kv';

interface RateLimitResult {
  success: boolean;
  error?: string;
  retryAfter?: number;
}

const KV_ENABLED = !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);

export async function rateLimit(clientId: string, ip: string): Promise<RateLimitResult> {
  if (!KV_ENABLED) return { success: true };

  try {
    const minKey = `rl:${clientId}:${ip}:min`;
    const minCount = await kv.incr(minKey);
    if (minCount === 1) await kv.expire(minKey, 60);
    if (minCount > 8) {
      return { success: false, error: 'Too many messages. Please wait a moment.', retryAfter: 60 };
    }

    const hourKey = `rl:${clientId}:${ip}:hour`;
    const hourCount = await kv.incr(hourKey);
    if (hourCount === 1) await kv.expire(hourKey, 3600);
    if (hourCount > 40) {
      return { success: false, error: 'Hourly limit reached. Try again later.', retryAfter: 3600 };
    }

    return { success: true };
  } catch {
    return { success: true };
  }
}
