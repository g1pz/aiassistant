import { NextRequest } from 'next/server';
import { randomUUID } from 'crypto';
import { appendBooking, getBookings, hasConflict } from '@/lib/googleSheets';
import { rateLimitBook } from '@/lib/rateLimit';

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
  call?: { id: string };
  toolCallList?: VapiToolCall[];
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
