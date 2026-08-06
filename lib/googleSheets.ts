import { google } from 'googleapis';

export interface SheetBooking {
  id: string;
  clientId: string;
  clientName: string;
  service?: string;
  date?: string;       // human-readable, e.g. "Thursday, 7 August"
  date_iso?: string;   // YYYY-MM-DD
  time?: string;       // HH:MM
  duration_min?: number;
  name?: string;
  contact?: string;
  createdAt: string;
}

const SHEET_NAME = 'Лист1';
const HEADERS = ['ID', 'clientId', 'clientName', 'service', 'date', 'date_iso', 'time', 'duration_min', 'name', 'contact', 'createdAt'];

function isConfigured(): boolean {
  return !!(
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL &&
    process.env.GOOGLE_PRIVATE_KEY &&
    process.env.GOOGLE_SHEET_ID
  );
}

function getAuth() {
  return new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
}

export async function getBookings(clientId: string): Promise<SheetBooking[]> {
  if (!isConfigured()) return [];

  try {
    const auth = getAuth();
    const sheets = google.sheets({ version: 'v4', auth });
    const sheetId = process.env.GOOGLE_SHEET_ID!;

    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: `${SHEET_NAME}!A2:K`,
    });

    const rows = res.data.values ?? [];
    return rows
      .map((row) => ({
        id:           row[0]  ?? '',
        clientId:     row[1]  ?? '',
        clientName:   row[2]  ?? '',
        service:      row[3]  || undefined,
        date:         row[4]  || undefined,
        date_iso:     row[5]  || undefined,
        time:         row[6]  || undefined,
        duration_min: row[7]  ? Number(row[7]) : undefined,
        name:         row[8]  || undefined,
        contact:      row[9]  || undefined,
        createdAt:    row[10] ?? '',
      }))
      .filter((b) => b.clientId === clientId && b.date_iso && b.time);
  } catch (err) {
    console.error('[googleSheets] getBookings error:', err);
    return [];
  }
}

// Returns true if the proposed slot conflicts with an existing booking.
// Conflict = same date AND times overlap considering durations.
export function hasConflict(
  bookings: SheetBooking[],
  date_iso: string,
  time: string,
  duration_min: number,
): boolean {
  const [h, m] = time.split(':').map(Number);
  const start = h * 60 + m;
  const end = start + duration_min;

  return bookings.some((b) => {
    if (b.date_iso !== date_iso) return false;
    const [bh, bm] = (b.time ?? '').split(':').map(Number);
    const bStart = bh * 60 + bm;
    const bEnd = bStart + (b.duration_min ?? 60);
    return start < bEnd && end > bStart;
  });
}

export async function appendBooking(booking: SheetBooking): Promise<void> {
  if (!isConfigured()) return;

  try {
    const auth = getAuth();
    const sheets = google.sheets({ version: 'v4', auth });
    const sheetId = process.env.GOOGLE_SHEET_ID!;

    // Ensure header row exists
    const header = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: `${SHEET_NAME}!A1:K1`,
    });
    if (!header.data.values?.length) {
      await sheets.spreadsheets.values.update({
        spreadsheetId: sheetId,
        range: `${SHEET_NAME}!A1:K1`,
        valueInputOption: 'RAW',
        requestBody: { values: [HEADERS] },
      });
    }

    await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: `${SHEET_NAME}!A:K`,
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS',
      requestBody: {
        values: [[
          booking.id,
          booking.clientId,
          booking.clientName,
          booking.service ?? '',
          booking.date ?? '',
          booking.date_iso ?? '',
          booking.time ?? '',
          booking.duration_min ?? '',
          booking.name ?? '',
          booking.contact ?? '',
          booking.createdAt,
        ]],
      },
    });
  } catch (err) {
    console.error('[googleSheets] appendBooking error:', err);
  }
}

function buildCalendar(): string {
  const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
                  'July', 'August', 'September', 'October', 'November', 'December'];
  const lines: string[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  for (let i = 0; i < 90; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const iso = d.toISOString().slice(0, 10);
    const dayName = DAYS[d.getDay()];
    const label = i === 0 ? ' (today)' : i === 1 ? ' (tomorrow)' : '';
    lines.push(`  ${dayName} = ${iso} = ${dayName} ${d.getDate()} ${MONTHS[d.getMonth()]}${label}`);
  }
  return lines.join('\n');
}

export function buildAvailabilityBlock(bookings: SheetBooking[]): string {
  const calendar = buildCalendar();
  const today = new Date().toISOString().slice(0, 10);

  const calendarSection = `\n\n---\n\nCALENDAR (use this to map weekday names to exact dates — do NOT guess):\n${calendar}`;

  if (bookings.length === 0) {
    return `${calendarSection}\n\nCURRENT BOOKINGS: none. All time slots are currently free.\nOnly offer dates from today (${today}) onwards.`;
  }

  const lines = bookings.map((b) => {
    const [h, m] = (b.time ?? '00:00').split(':').map(Number);
    const endMin = h * 60 + m + (b.duration_min ?? 60);
    const endH = String(Math.floor(endMin / 60)).padStart(2, '0');
    const endM = String(endMin % 60).padStart(2, '0');
    return `- ${b.date_iso} ${b.time}–${endH}:${endM} (${b.service ?? 'appointment'}, ${b.duration_min ?? 60} min) — ${b.name ?? 'client'}`;
  });

  return `${calendarSection}\n\nCURRENT BOOKINGS — these slots are UNAVAILABLE:\n${lines.join('\n')}\n\nBefore suggesting or confirming any time, check BOTH the calendar above (for correct dates) and the bookings list (for conflicts). If a requested slot overlaps with an existing booking (accounting for duration), say it's taken and suggest the nearest free slot. Only offer dates from today (${today}) onwards.`;
}
