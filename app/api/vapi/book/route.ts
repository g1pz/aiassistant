import { NextRequest } from 'next/server';
import { randomUUID } from 'crypto';
import { appendBooking, getBookings, hasConflict } from '@/lib/googleSheets';
import { rateLimitBook } from '@/lib/rateLimit';
import { logVapiUsage } from '@/lib/logUsage';
import { getClient } from '@/lib/clients/index';

type Lang = 'en' | 'ru' | 'et';
const LANG_NAME: Record<Lang, string> = { en: 'English', ru: 'Russian', et: 'Estonian' };

interface VapiToolCall {
  id: string;
  type: 'function';
  function: {
    name: string;
    arguments: Record<string, string> | string;
  };
}

interface VapiMessage {
  type: string;
  call?: {
    id: string;
    assistantOverrides?: { variableValues?: Record<string, string> };
    metadata?: Record<string, string>;
  };
  toolCallList?: VapiToolCall[];
  durationSeconds?: number;
  cost?: number;
}

interface VapiWebhookBody {
  message: VapiMessage;
}

function escapeMd(text: string): string {
  return text.replace(/[_*[\]()~`>#+=|{}.!\\-]/g, '\\$&');
}

function parseArgs(raw: Record<string, string> | string): Record<string, string> {
  if (typeof raw === 'string') {
    try { return JSON.parse(raw); } catch { return {}; }
  }
  return raw ?? {};
}

function getIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  return forwarded ? forwarded.split(',')[0].trim() : 'vapi';
}

async function sendTelegram(text: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;
  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'Markdown' }),
  }).catch(() => {});
}

export async function POST(request: NextRequest) {
  // Fail-closed: secret MUST be configured and MUST match
  const secret = process.env.VAPI_WEBHOOK_SECRET;
  if (!secret) {
    return Response.json({ error: 'Webhook not configured' }, { status: 503 });
  }
  const incoming = request.headers.get('x-vapi-secret');
  if (incoming !== secret) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Rate limit by IP (Vapi calls come from their servers — limits abuse via compromised secret)
  const ip = getIp(request);
  const limitResult = await rateLimitBook(ip);
  if (!limitResult.success) {
    return Response.json({ error: limitResult.error }, {
      status: 429,
      headers: { 'Retry-After': String(limitResult.retryAfter) },
    });
  }

  let body: VapiWebhookBody;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { message } = body;

  // Return full assistant config server-side — system prompt never goes through browser
  if (message?.type === 'assistant-request') {
    const vars = message.call?.assistantOverrides?.variableValues ?? message.call?.metadata ?? {};
    const clientId = vars.clientId ?? 'unknown';
    const rawLang = vars.lang ?? 'en';
    const lang: Lang = rawLang === 'ru' ? 'ru' : rawLang === 'et' ? 'et' : 'en';

    const client = getClient(clientId);
    if (!client) return Response.json({ error: 'Client not found' }, { status: 404 });

    const today = new Date();
    const current_date = today.toLocaleDateString('en-GB', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    });
    const systemPrompt =
      `TODAY'S DATE: ${current_date}. Use this for ALL date references.\n` +
      `MANDATORY LANGUAGE: You MUST speak and respond in ${LANG_NAME[lang]} for the ENTIRE conversation.\n\n` +
      client.systemPrompt;

    const raw = client.welcomeMessages?.[lang] ?? client.welcomeMessages?.['en'] ?? '';
    const firstMessage = raw
      .replace(/[\u{1F000}-\u{1FFFF}\u{2600}-\u{27BF}\u{FE00}-\u{FE0F}]/gu, '')
      .replace(/\s+/g, ' ').trim();

    const vapiModel = process.env.NEXT_PUBLIC_VAPI_MODEL ?? 'claude-haiku-4-5-20251001';

    return Response.json({
      assistant: {
        firstMessage,
        model: {
          provider: 'anthropic',
          model: vapiModel,
          messages: [{ role: 'system', content: systemPrompt }],
        },
      },
    });
  }

  // Log Vapi call cost when call ends
  if (message?.type === 'end-of-call-report') {
    const clientId =
      message.call?.assistantOverrides?.variableValues?.clientId ??
      message.call?.metadata?.clientId ??
      'unknown';
    logVapiUsage(clientId, message.durationSeconds ?? 0, message.cost ?? 0).catch(() => {});
    return Response.json({ received: true });
  }

  // Only handle tool-calls; acknowledge everything else silently
  if (message?.type !== 'tool-calls') {
    return Response.json({ results: [] });
  }

  const results: { toolCallId: string; result: string }[] = [];

  for (const call of message.toolCallList ?? []) {
    if (call.function?.name !== 'book_table') {
      results.push({ toolCallId: call.id, result: 'Unknown tool.' });
      continue;
    }

    const args = parseArgs(call.function.arguments);
    const { guests, date, date_iso, time, name, contact } = args;

    if (!name || !date_iso || !time || !guests) {
      results.push({ toolCallId: call.id, result: 'Missing required booking information.' });
      continue;
    }

    // Validate date_iso format
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date_iso)) {
      results.push({ toolCallId: call.id, result: 'Invalid date format.' });
      continue;
    }

    // Check slot availability before booking (prevent race condition from voice calls)
    const existing = await getBookings('bella-cucina');
    if (hasConflict(existing, date_iso, time, 90)) {
      results.push({ toolCallId: call.id, result: `Sorry, that time is already taken. Please choose another time.` });
      continue;
    }

    await appendBooking({
      id: randomUUID(),
      clientId: 'bella-cucina',
      clientName: 'Bella Cucina',
      service: `Table for ${guests} guests`,
      date,
      date_iso,
      time,
      duration_min: 90,
      name,
      contact,
      createdAt: new Date().toISOString(),
    });

    const confirmation = `Your table for ${guests} is confirmed for ${date} at ${time} under the name ${name}. We look forward to seeing you at Bella Cucina!`;

    sendTelegram(
      `🍽️ *Новая бронь (голосовой звонок) — Bella Cucina*\n\n` +
      `👥 *Гостей:* ${escapeMd(guests)}\n📅 *Дата:* ${escapeMd(date ?? '')}\n⏰ *Время:* ${escapeMd(time)}\n👤 *Имя:* ${escapeMd(name)}\n📱 *Контакт:* ${escapeMd(contact ?? '—')}\n\n_via Vapi voice call_`
    );

    results.push({ toolCallId: call.id, result: confirmation });
  }

  return Response.json({ results });
}
