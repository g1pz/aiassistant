import { supabase } from './supabase';

const CLAUDE_INPUT_PRICE  = 3.00 / 1_000_000;  // $3.00 per 1M (Sonnet 4.6)
const CLAUDE_OUTPUT_PRICE = 15.00 / 1_000_000; // $15.00 per 1M (Sonnet 4.6)

export async function logClaudeUsage(
  clientId: string,
  inputTokens: number,
  outputTokens: number,
) {
  const costUsd =
    inputTokens * CLAUDE_INPUT_PRICE +
    outputTokens * CLAUDE_OUTPUT_PRICE;

  console.log('[logUsage] inserting claude:', { clientId, inputTokens, outputTokens, costUsd });
  const { error } = await supabase.from('usage_logs').insert({
    client_id:  clientId,
    service:    'claude',
    tokens_in:  inputTokens,
    tokens_out: outputTokens,
    minutes:    null,
    cost_usd:   costUsd,
  });
  if (error) console.error('[logUsage] supabase error:', error);
}

export async function logVapiUsage(
  clientId: string,
  durationSeconds: number,
  costUsd: number,
) {
  await supabase.from('usage_logs').insert({
    client_id:  clientId,
    service:    'vapi',
    tokens_in:  null,
    tokens_out: null,
    minutes:    durationSeconds / 60,
    cost_usd:   costUsd,
  });
}
