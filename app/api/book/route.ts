import { NextRequest } from 'next/server';
import { randomUUID } from 'crypto';
import { saveBooking } from '@/lib/bookings';
import { getBookings, appendBooking, hasConflict } from '@/lib/googleSheets';
import { getClient } from '@/lib/clients/index';

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

async function sendTelegram(token: string, chatId: string, text: string) {
  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'Markdown' }),
  });
}

export async function POST(request: NextRequest) {
  const body: BookingPayload = await request.json();
  const { clientId, clientName, bookingData } = body;

  if (!clientId || !bookingData) {
    return Response.json({ error: 'Missing required fields' }, { status: 400 });
  }

  // Resolve service duration from client config
  const clientConfig = getClient(clientId);
  const serviceRecord = clientConfig?.services?.find(
    (s) => s.name === bookingData.service ||
            Object.values(s.nameI18n ?? {}).includes(bookingData.service ?? '')
  );
  const duration_min = serviceRecord ? parseDuration(serviceRecord.duration) : 60;

  // Basic race-condition guard: re-check availability right before writing
  if (bookingData.date_iso && bookingData.time) {
    const currentBookings = await getBookings(clientId);
    if (hasConflict(currentBookings, bookingData.date_iso, bookingData.time, duration_min)) {
      return Response.json(
        { error: 'conflict', message: 'This time slot was just taken. Please choose another time.' },
        { status: 409 }
      );
    }
  }

  const id = randomUUID();
  const createdAt = new Date().toISOString();

  // Save to local JSON (fallback / always works)
  saveBooking({ clientId, clientName, ...bookingData });

  // Save to Google Sheets (if configured)
  await appendBooking({
    id,
    clientId,
    clientName,
    service:      bookingData.service,
    date:         bookingData.date,
    date_iso:     bookingData.date_iso,
    time:         bookingData.time,
    duration_min,
    name:         bookingData.name,
    contact:      bookingData.contact,
    createdAt,
  });

  // Telegram notification (if configured)
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (token && chatId) {
    const rows = [
      bookingData.service  && `✂️ *Услуга:* ${bookingData.service}`,
      bookingData.date     && `📅 *Дата:* ${bookingData.date}`,
      bookingData.time     && `⏰ *Время:* ${bookingData.time}`,
      bookingData.name     && `👤 *Имя:* ${bookingData.name}`,
      bookingData.contact  && `📱 *Контакт:* ${bookingData.contact}`,
    ].filter(Boolean).join('\n');
    sendTelegram(token, chatId, `💅 *Новая запись — ${clientName}*\n\n${rows}\n\n_Demo bot via VORVEX_`).catch(() => {});
  }

  return Response.json({ success: true, id });
}
