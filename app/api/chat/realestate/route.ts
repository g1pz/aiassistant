import { NextRequest } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { rateLimit } from '@/lib/rateLimit';
import { SYSTEM_PROMPT } from '@/lib/knowledgeBase';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const MODEL = process.env.CLAUDE_MODEL || 'claude-haiku-4-5-20251001';

export async function POST(request: NextRequest) {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed.' }), { status: 405 });
  }

  const forwarded = request.headers.get('x-forwarded-for');
  if (!forwarded) {
    return new Response(JSON.stringify({ error: 'Unable to identify client.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  const ip = forwarded.split(',')[0].trim();

  const limitResult = await rateLimit('realestate', ip);
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

  try {
    const stream = anthropic.messages.stream({
      model: MODEL,
      max_tokens: 500,
      system: SYSTEM_PROMPT,
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
