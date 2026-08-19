import { getClient } from '@/lib/clients/index';

type Lang = 'en' | 'ru' | 'et';

const LANG_NAME: Record<Lang, string> = {
  en: 'English',
  ru: 'Russian',
  et: 'Estonian',
};

export async function GET(req: Request) {
  // Vapi calls this server-to-server — require the shared webhook secret
  const secret = process.env.VAPI_WEBHOOK_SECRET;
  if (secret) {
    const incoming =
      new URL(req.url).searchParams.get('secret') ??
      (req as Request & { headers: Headers }).headers?.get('x-vapi-secret') ?? '';
    if (incoming !== secret) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  const { searchParams } = new URL(req.url);
  const clientId = searchParams.get('clientId') ?? '';
  const rawLang = searchParams.get('lang') ?? 'en';
  const lang: Lang = rawLang === 'ru' ? 'ru' : rawLang === 'et' ? 'et' : 'en';

  const client = getClient(clientId);
  if (!client) {
    return Response.json({ error: 'Client not found' }, { status: 404 });
  }

  // Server-side date — always accurate
  const today = new Date();
  const current_date = today.toLocaleDateString('en-GB', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  const langName = LANG_NAME[lang];

  // Prepend date + language mandate to the existing system prompt
  const systemPrompt =
    `TODAY'S DATE: ${current_date}. Use this for ALL date references — "today", "tomorrow", "this weekend", etc.\n` +
    `MANDATORY LANGUAGE: You MUST speak and respond in ${langName} for the ENTIRE conversation. Start your greeting in ${langName} immediately.\n\n` +
    client.systemPrompt;

  // Clean greeting for TTS — no emojis, no markdown
  const raw = client.welcomeMessages?.[lang] ?? client.welcomeMessages?.['en'] ?? '';
  const firstMessage = raw
    .replace(/[\u{1F000}-\u{1FFFF}\u{2600}-\u{27BF}\u{FE00}-\u{FE0F}]/gu, '')
    .replace(/\s+/g, ' ')
    .trim();

  return Response.json({ systemPrompt, firstMessage });
}
