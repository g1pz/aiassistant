import { NextRequest } from 'next/server';
import { randomUUID } from 'crypto';
import { getBookings, appendBooking, hasConflict } from '@/lib/googleSheets';
import { getClient } from '@/lib/clients/index';
import { rateLimitBook } from '@/lib/rateLimit';

interface BookingPayload {
  clientId: string;
  clientName: string;
  bookingData: {
    service?: string;
    date?: string;
    date_iso?: string;
    time?: string;
    name?: string;
    contact?: string;
  };
}

function parseDuration(durationStr: string): number {
  const match = durationStr.match(/(\d+)/);
  return match ? parseInt(match[1]) : 60;
}

// Escape special Telegram Markdown v1 characters to prevent injection
function escapeMd(text: string): string {
  return text.replace(/[_*[\]()~`>#+=|{}.!\\-]/g, '\\$&');
}

async function sendTelegram(token: string, chatId: string, text: string) {
  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'Markdown' }),
  });
}

function getIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return 'unknown';
}

function validateField(value: unknown, maxLen: number): string | null {
  if (value === undefined || value === null) return null;
  if (typeof value !== 'string') return null;
  // Strip HTML tags (<script>, <img>, etc.) — these fields are plain text only
  const stripped = value.replace(/<[^>]*>/g, '').slice(0, maxLen).trim();
  if (!stripped) return null;
  // Prevent Google Sheets formula injection: prefix dangerous leading characters with apostrophe
  return /^[=+\-@]/.test(stripped) ? `'${stripped}` : stripped;
}

export async function POST(request: NextRequest) {
  // Rate limit by IP
  const ip = getIp(request);
  const limitResult = await rateLimitBook(ip);
  if (!limitResult.success) {
    return Response.json({ error: limitResult.error }, {
      status: 429,
      headers: { 'Retry-After': String(limitResult.retryAfter) },
    });
  }

  let body: BookingPayload;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { clientId, bookingData } = body;

  if (!clientId || !bookingData) {
    return Response.json({ error: 'Missing required fields' }, { status: 400 });
  }

  // Validate clientId against known clients — reject unknown/garbage IDs
  const clientConfig = getClient(clientId);
  if (!clientConfig) {
    return Response.json({ error: 'Invalid client' }, { status: 400 });
  }

  // Sanitize and length-limit all user-supplied fields
  const safeBookingData = {
    service:  validateField(bookingData.service,  200),
    date:     validateField(bookingData.date,     100),
    date_iso: validateField(bookingData.date_iso, 10),
    time:     validateField(bookingData.time,     5),
    name:     validateField(bookingData.name,     100),
    contact:  validateField(bookingData.contact,  100),
  };

  // Validate date_iso format if provided
  if (safeBookingData.date_iso && !/^\d{4}-\d{2}-\d{2}$/.test(safeBookingData.date_iso)) {
    return Response.json({ error: 'Invalid date format' }, { status: 400 });
  }

  // Validate time format if provided
  if (safeBookingData.time && !/^\d{1,2}:\d{2}$/.test(safeBookingData.time)) {
    return Response.json({ error: 'Invalid time format' }, { status: 400 });
  }

  const clientName = clientConfig.name;

  // Resolve service duration from client config
  const serviceRecord = clientConfig?.services?.find(
    (s) => s.name === safeBookingData.service ||
            Object.values(s.nameI18n ?? {}).includes(safeBookingData.service ?? '')
  );
  const duration_min = serviceRecord ? parseDuration(serviceRecord.duration) : 60;

  // Race-condition guard: re-check availability right before writing
  if (safeBookingData.date_iso && safeBookingData.time) {
    const currentBookings = await getBookings(clientId);
    if (hasConflict(currentBookings, safeBookingData.date_iso, safeBookingData.time, duration_min)) {
      return Response.json(
        { error: 'conflict', message: 'This time slot was just taken. Please choose another time.' },
        { status: 409 }
      );
    }
  }

  const id = randomUUID();
  const createdAt = new Date().toISOString();

  // Save to Google Sheets (if configured)
  await appendBooking({
    id,
    clientId,
    clientName,
    service:      safeBookingData.service ?? undefined,
    date:         safeBookingData.date ?? undefined,
    date_iso:     safeBookingData.date_iso ?? undefined,
    time:         safeBookingData.time ?? undefined,
    duration_min,
    name:         safeBookingData.name ?? undefined,
    contact:      safeBookingData.contact ?? undefined,
    createdAt,
  });

  // Telegram notification (if configured) — escape user data to prevent Markdown injection
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (token && chatId) {
    const rows = [
      safeBookingData.service  && `✂️ *Услуга:* ${escapeMd(safeBookingData.service)}`,
      safeBookingData.date     && `📅 *Дата:* ${escapeMd(safeBookingData.date)}`,
      safeBookingData.time     && `⏰ *Время:* ${escapeMd(safeBookingData.time)}`,
      safeBookingData.name     && `👤 *Имя:* ${escapeMd(safeBookingData.name)}`,
      safeBookingData.contact  && `📱 *Контакт:* ${escapeMd(safeBookingData.contact)}`,
    ].filter(Boolean).join('\n');
    sendTelegram(
      token, chatId,
      `💅 *Новая запись — ${escapeMd(clientName)}*\n\n${rows}\n\n_Demo bot via VORVEX_`
    ).catch(() => {});
  }

  return Response.json({ success: true, id });
}
