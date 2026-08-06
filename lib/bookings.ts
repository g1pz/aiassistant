import fs from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';

export interface Booking {
  id: string;
  clientId: string;
  clientName: string;
  service?: string;
  date?: string;
  time?: string;
  name?: string;
  contact?: string;
  createdAt: string;
}

const FILE = path.join(process.cwd(), 'data', 'bookings.json');

function ensureFile() {
  const dir = path.dirname(FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(FILE)) fs.writeFileSync(FILE, '[]', 'utf-8');
}

export function readBookings(): Booking[] {
  ensureFile();
  try {
    return JSON.parse(fs.readFileSync(FILE, 'utf-8')) as Booking[];
  } catch {
    return [];
  }
}

export function saveBooking(data: Omit<Booking, 'id' | 'createdAt'>): Booking {
  const bookings = readBookings();
  const booking: Booking = { ...data, id: randomUUID(), createdAt: new Date().toISOString() };
  bookings.unshift(booking);
  fs.writeFileSync(FILE, JSON.stringify(bookings, null, 2), 'utf-8');
  return booking;
}

export function deleteBooking(id: string): boolean {
  const bookings = readBookings();
  const next = bookings.filter((b) => b.id !== id);
  if (next.length === bookings.length) return false;
  fs.writeFileSync(FILE, JSON.stringify(next, null, 2), 'utf-8');
  return true;
}

export function clearBookings() {
  fs.writeFileSync(FILE, '[]', 'utf-8');
}
