// src/app/api/enhance-summary/route.ts
// OpenAI GPT-4o streaming route handler for AI executive narrative.
// CRITICAL: runtime = 'nodejs' must be top-level export — edge runtime lacks Node.js built-ins
// required by the OpenAI SDK (node:stream, node:http).
export const runtime = 'nodejs';

import OpenAI from 'openai';
import { NextRequest } from 'next/server';

// Lazily instantiated inside POST so that module-level import does not throw
// when OPENAI_API_KEY is absent (e.g., in Vitest test environment).
let _openai: OpenAI | null = null;
function getOpenAI(): OpenAI {
  if (!_openai) {
    _openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return _openai;
}

export interface KpiPayload {
  netSales: string;
  cogs: string;
  grossProfit: string;
  ebitda: string;
  cash: string;
  ar: string;
  ap: string;
  inventory: string;
}

// Pure function — exported for Vitest testability (no React, no fetch).
// Produces the user message sent to GPT-4o. Contains all 8 KPI labels
// plus the preset name so the AI can reference scenario context.
export function buildUserPrompt(kpis: KpiPayload, presetName: string): string {
  return [
    `Scenario: ${presetName}`,
    `Net Sales: ${kpis.netSales}`,
    `COGS: ${kpis.cogs}`,
    `Gross Profit: ${kpis.grossProfit}`,
    `EBITDA: ${kpis.ebitda}`,
    `Cash: ${kpis.cash}`,
    `Accounts Receivable: ${kpis.ar}`,
    `Accounts Payable: ${kpis.ap}`,
    `Inventory: ${kpis.inventory}`,
    '',
    'Write the two-paragraph executive summary.',
  ].join('\n');
}

export async function POST(req: NextRequest) {
  try {
    const { kpis, presetName } = (await req.json()) as {
      kpis: KpiPayload;
      presetName: string;
    };

    // Use the non-beta stable API surface: chat.completions.create with stream: true.
    // Returns AsyncIterable<ChatCompletionChunk> — iterate with for-await.
    // Do NOT use .beta.stream() — wider version range compatibility with openai ^4.0.0.
    const stream = await getOpenAI().chat.completions.create({
      model: 'gpt-4o',
      max_tokens: 300,
      temperature: 0.3,
      stream: true,
      messages: [
        {
          role: 'system',
          content:
            'You are a senior FP&A analyst at Crowe LLP preparing a briefing for your client Summit Logistics Group. Write a concise two-paragraph executive summary about Summit Logistics Group\'s month-end close results. Always refer to the company as "Summit Logistics Group". First paragraph: current period performance. Second paragraph: forward-looking close risks. Use plain prose, no bullet points, no markdown.',
        },
        {
          role: 'user',
          content: buildUserPrompt(kpis, presetName),
        },
      ],
    });

    // Pipe the AsyncIterable stream through a native ReadableStream.
    // controller.error() propagates mid-stream failures to the client reader.
    const readable = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        try {
          for await (const chunk of stream) {
            const text = chunk.choices[0]?.delta?.content ?? '';
            if (text) controller.enqueue(encoder.encode(text));
          }
          controller.close();
        } catch (err) {
          controller.error(err);
        }
      },
    });

    return new Response(readable, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
