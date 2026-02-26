import { NextResponse } from "next/server";
import type { ExecutiveSummary } from "@/features/model/types";

const PROMPT = `Rephrase the summary for executive readability. Keep all numeric facts unchanged and preserve risk meaning.`;

export async function POST(request: Request) {
  const body = (await request.json()) as { summary: ExecutiveSummary };
  const summary = body.summary;

  if (process.env.LLM_ENHANCE !== "true" || !process.env.OPENAI_API_KEY) {
    return NextResponse.json({ summary: { ...summary, enhancedByLlm: false } });
  }

  try {
    const timeout = AbortSignal.timeout(3500);
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      signal: timeout,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        input: `${PROMPT}\n\n${JSON.stringify(summary, null, 2)}`,
      }),
    });

    if (!response.ok) {
      return NextResponse.json({ summary: { ...summary, enhancedByLlm: false } });
    }

    const payload = (await response.json()) as { output_text?: string };
    const text = payload.output_text?.trim();
    if (!text) {
      return NextResponse.json({ summary: { ...summary, enhancedByLlm: false } });
    }

    const rewritten = text
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .slice(0, 10);

    return NextResponse.json({
      summary: {
        ...summary,
        bullets: rewritten.length > 0 ? rewritten : summary.bullets,
        enhancedByLlm: rewritten.length > 0,
      },
    });
  } catch {
    return NextResponse.json({ summary: { ...summary, enhancedByLlm: false } });
  }
}
