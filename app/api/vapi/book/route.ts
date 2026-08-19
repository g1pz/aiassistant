import { NextRequest } from 'next/server';
import { randomUUID } from 'crypto';
import { appendBooking } from '@/lib/googleSheets';

// Vapi sends a POST when the assistant invokes the book_table tool.
// We save to Google Sheets and return a confirmation string Vapi reads aloud.

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
  // Optional webhook secret verification
  const secret = process.env.VAPI_WEBHOOK_SECRET;
  if (secret) {
    const incoming = request.headers.get('x-vapi-secret');
    if (incoming !== secret) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  const body: VapiWebhookBody = await request.json();
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
