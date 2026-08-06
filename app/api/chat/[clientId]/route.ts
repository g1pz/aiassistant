import { NextRequest } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { rateLimit } from '@/lib/rateLimit';
import { getClient } from '@/lib/clients/index';
import { getBookings, buildAvailabilityBlock } from '@/lib/googleSheets';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const MODEL = process.env.CLAUDE_MODEL || 'claude-haiku-4-5-20251001';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ clientId: string }> }
) {
  const { clientId } = await params;

  const client = getClient(clientId);
  if (!client) {
    return new Response(JSON.stringify({ error: 'Client not found.' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const forwarded = request.headers.get('x-forwarded-for');
  if (!forwarded) {
    return new Response(JSON.stringify({ error: 'Unable to identify client.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  const ip = forwarded.split(',')[0].trim();

  const limitResult = await rateLimit(clientId, ip);
  if (!limitResult.success) {
    return new Response(JSON.stringify({ error: limitResult.error }), {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        'Retry-After': String(limitResult.retryAfter),
      },
    });
  }

  const body = await request.json();
  const messages: Anthropic.MessageParam[] = (body.messages ?? []).slice(-20);

  // Fetch current bookings and append availability block to system prompt
  const bookings = await getBookings(clientId);
  console.log(`[chat/${clientId}] bookings fetched: ${bookings.length}`, bookings.map(b => `${b.date_iso} ${b.time} ${b.service}`));
  const systemPrompt = client.systemPrompt + buildAvailabilityBlock(bookings);

  try {
    const stream = anthropic.messages.stream({
      model: MODEL,
      max_tokens: 500,
      system: systemPrompt,
      messages,
    });

    const readable = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        try {
          for await (const chunk of stream) {
            if (
              chunk.type === 'content_block_delta' &&
              chunk.delta.type === 'text_delta'
            ) {
              controller.enqueue(encoder.encode(chunk.delta.text));
            }
          }
          controller.close();
        } catch {
          controller.error(new Error('Stream error'));
        }
      },
    });

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        'X-Accel-Buffering': 'no',
      },
    });
  } catch {
    return new Response(JSON.stringify({ error: 'Service temporarily unavailable.' }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
