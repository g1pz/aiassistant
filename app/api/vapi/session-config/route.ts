import { NextRequest } from 'next/server';
import { getClient } from '@/lib/clients/index';
import { rateLimitBook } from '@/lib/rateLimit';

type Lang = 'en' | 'ru' | 'et';

const LANG_NAME: Record<Lang, string> = {
  en: 'English',
  ru: 'Russian',
  et: 'Estonian',
};

function getIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  return forwarded ? forwarded.split(',')[0].trim() : 'vapi';
}

export async function GET(request: NextRequest) {
  // Fail-closed: secret MUST be configured and MUST match
  const secret = process.env.VAPI_WEBHOOK_SECRET;
  if (!secret) {
    return Response.json({ error: 'Endpoint not configured' }, { status: 503 });
  }
  const { searchParams } = new URL(request.url);
  const incoming =
    searchParams.get('secret') ??
    request.headers.get('x-vapi-secret') ?? '';
  if (incoming !== secret) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Rate limit to prevent bulk scraping of system prompts
  const ip = getIp(request);
  const limitResult = await rateLimitBook(ip);
  if (!limitResult.success) {
    return Response.json({ error: limitResult.error }, {
      status: 429,
      headers: { 'Retry-After': String(limitResult.retryAfter) },
    });
  }

  const clientId = searchParams.get('clientId') ?? '';
  const rawLang = searchParams.get('lang') ?? 'en';
  const lang: Lang = rawLang === 'ru' ? 'ru' : rawLang === 'et' ? 'et' : 'en';

  const client = getClient(clientId);
  if (!client) {
    return Response.json({ error: 'Client not found' }, { status: 404 });
  }

  const today = new Date();
  const current_date = today.toLocaleDateString('en-GB', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  const langName = LANG_NAME[lang];

  const systemPrompt =
    `TODAY'S DATE: ${current_date}. Use this for ALL date references — "today", "tomorrow", "this weekend", etc.\n` +
    `MANDATORY LANGUAGE: You MUST speak and respond in ${langName} for the ENTIRE conversation. Start your greeting in ${langName} immediately.\n\n` +
    client.systemPrompt;

  const raw = client.welcomeMessages?.[lang] ?? client.welcomeMessages?.['en'] ?? '';
  const firstMessage = raw
    .replace(/[\u{1F000}-\u{1FFFF}\u{2600}-\u{27BF}\u{FE00}-\u{FE0F}]/gu, '')
    .replace(/\s+/g, ' ')
    .trim();

  return Response.json({ systemPrompt, firstMessage });
}
