import { pb } from "./pocketbase";
import { SITE } from "./site";

// Pricing per 1M tokens (USD) — update when Gemini price changes
const PRICING: Record<string, { in: number; out: number }> = {
  "gemini-2.5-flash": { in: 0.075, out: 0.3 },
  "gemini-2.5-pro": { in: 1.25, out: 5.0 },
  "gemini-2.0-flash": { in: 0.075, out: 0.3 },
  // OpenRouter free models — count as $0
  "openai/gpt-oss-20b:free": { in: 0, out: 0 },
  "openai/gpt-oss-120b:free": { in: 0, out: 0 },
  "z-ai/glm-4.5-air:free": { in: 0, out: 0 },
  "meta-llama/llama-3.3-70b-instruct:free": { in: 0, out: 0 },
};

export type UsageInput = {
  provider: "gemini" | "openrouter";
  model: string;
  inputTokens: number;
  outputTokens: number;
  videoId?: string;
  channel?: string;
  status: "ok" | "error";
};

export function calcCost(model: string, inTok: number, outTok: number): number {
  const p = PRICING[model];
  if (!p) return 0;
  return (inTok / 1_000_000) * p.in + (outTok / 1_000_000) * p.out;
}

/** Log a single LLM call into janepat_usage collection */
export async function logUsage(input: UsageInput): Promise<void> {
  try {
    const cost = calcCost(input.model, input.inputTokens, input.outputTokens);
    await pb().collection("janepat_usage").create({
      provider: input.provider,
      model: input.model,
      input_tokens: input.inputTokens,
      output_tokens: input.outputTokens,
      cost_usd: cost,
      video_id: input.videoId ?? "",
      channel: input.channel ?? "",
      status: input.status,
    });
  } catch {
    // Logging failures should not break the main flow
  }
}

/** Sum of cost_usd between [start, end) — used by budget cap + dashboard */
export async function sumUsageBetween(startISO: string, endISO: string): Promise<{
  totalUsd: number;
  totalInTokens: number;
  totalOutTokens: number;
  callCount: number;
}> {
  try {
    const base = SITE.pocketbase.url;
    const params = new URLSearchParams({
      filter: `created >= "${startISO}" && created < "${endISO}"`,
      perPage: "1000",
    });
    const res = await fetch(`${base}/api/collections/janepat_usage/records?${params}`, { cache: "no-store" });
    if (!res.ok) return { totalUsd: 0, totalInTokens: 0, totalOutTokens: 0, callCount: 0 };
    const data = (await res.json()) as { items?: Array<{ cost_usd?: number; input_tokens?: number; output_tokens?: number }> };
    const items = data.items ?? [];
    return {
      totalUsd: items.reduce((s, it) => s + (it.cost_usd ?? 0), 0),
      totalInTokens: items.reduce((s, it) => s + (it.input_tokens ?? 0), 0),
      totalOutTokens: items.reduce((s, it) => s + (it.output_tokens ?? 0), 0),
      callCount: items.length,
    };
  } catch {
    return { totalUsd: 0, totalInTokens: 0, totalOutTokens: 0, callCount: 0 };
  }
}

/** Today's spend in USD — used by hard budget cap */
export async function getTodayCostUsd(): Promise<number> {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0).toISOString();
  const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0).toISOString();
  const { totalUsd } = await sumUsageBetween(startOfDay, endOfDay);
  return totalUsd;
}

/** Daily aggregate for chart — past N days */
export async function getDailyUsage(days = 30): Promise<Array<{ date: string; usd: number; calls: number }>> {
  try {
    const base = SITE.pocketbase.url;
    const start = new Date();
    start.setDate(start.getDate() - days);
    const params = new URLSearchParams({
      filter: `created >= "${start.toISOString()}"`,
      perPage: "5000",
    });
    const res = await fetch(`${base}/api/collections/janepat_usage/records?${params}`, { cache: "no-store" });
    if (!res.ok) return [];
    const data = (await res.json()) as { items?: Array<{ created: string; cost_usd?: number }> };
    const items = data.items ?? [];
    const buckets = new Map<string, { usd: number; calls: number }>();
    for (const it of items) {
      const d = it.created.slice(0, 10);
      const cur = buckets.get(d) ?? { usd: 0, calls: 0 };
      cur.usd += it.cost_usd ?? 0;
      cur.calls += 1;
      buckets.set(d, cur);
    }
    return Array.from(buckets.entries())
      .map(([date, v]) => ({ date, usd: v.usd, calls: v.calls }))
      .sort((a, b) => a.date.localeCompare(b.date));
  } catch {
    return [];
  }
}
