import { redirect } from "next/navigation";
import { sumUsageBetween, getDailyUsage } from "@/lib/usage";

export const dynamic = "force-dynamic";

type Search = Promise<{ secret?: string }>;

export default async function UsagePage({ searchParams }: { searchParams: Search }) {
  const { secret } = await searchParams;
  const expected = process.env.CRON_SECRET;

  if (!expected || secret !== expected) {
    redirect("/");
  }

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0).toISOString();
  const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0).toISOString();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1).toISOString();

  const [today, month, daily] = await Promise.all([
    sumUsageBetween(todayStart, todayEnd),
    sumUsageBetween(monthStart, monthEnd),
    getDailyUsage(30),
  ]);

  const dailyBudget = Number(process.env.GEMINI_DAILY_BUDGET_USD ?? "0.50");
  const todayPercent = Math.min(100, (today.totalUsd / dailyBudget) * 100);

  // Build sparkline points for last 30 days
  const maxUsd = Math.max(...daily.map((d) => d.usd), 0.001);
  const w = 600;
  const h = 100;
  const step = daily.length > 1 ? w / (daily.length - 1) : 0;
  const points = daily.map((d, i) => {
    const x = i * step;
    const y = h - (d.usd / maxUsd) * (h - 10);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });

  return (
    <div className="min-h-screen bg-[#faf9f5] py-12">
      <div className="mx-auto max-w-[1200px] px-6">
        <header className="mb-10">
          <div className="text-[12px] font-medium uppercase tracking-[1.5px] text-[#cc785c]">
            Admin · Usage Monitor
          </div>
          <h1 className="mt-2 font-display text-[40px] tracking-[-0.6px] text-[#141413]">
            LLM Usage & Cost
          </h1>
          <p className="mt-2 text-[14px] text-[#6c6a64]">
            Track Gemini + OpenRouter spending. Hard cap stops Gemini calls when daily budget exceeded → falls back to free OpenRouter.
          </p>
        </header>

        {/* Summary cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card label="วันนี้ (USD)" value={`$${today.totalUsd.toFixed(4)}`} sub={`${today.callCount} calls`} />
          <Card
            label="Daily budget"
            value={`$${dailyBudget.toFixed(2)}`}
            sub={`${todayPercent.toFixed(0)}% used today`}
            tone={todayPercent > 80 ? "warn" : todayPercent > 50 ? "neutral" : "ok"}
          />
          <Card
            label="เดือนนี้ (USD)"
            value={`$${month.totalUsd.toFixed(2)}`}
            sub={`${month.callCount} calls · ${(month.totalInTokens / 1_000_000).toFixed(2)}M in / ${(month.totalOutTokens / 1_000_000).toFixed(2)}M out`}
          />
          <Card
            label="ประมาณ THB เดือนนี้"
            value={`฿${(month.totalUsd * 36).toFixed(0)}`}
            sub="@ 36 THB/USD"
          />
        </div>

        {/* Budget progress */}
        <div className="rounded-xl border border-[#e6dfd8] bg-white p-6 mb-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-sans font-bold text-[15px] text-[#141413]">Today vs Budget</h2>
            <span className="text-[13px] text-[#6c6a64]">
              ${today.totalUsd.toFixed(4)} / ${dailyBudget.toFixed(2)}
            </span>
          </div>
          <div className="h-3 w-full overflow-hidden rounded-full bg-[#e6dfd8]">
            <div
              className={`h-full transition-all ${
                todayPercent > 80 ? "bg-[#c64545]" : todayPercent > 50 ? "bg-[#e8a55a]" : "bg-[#cc785c]"
              }`}
              style={{ width: `${todayPercent}%` }}
            />
          </div>
          <div className="mt-3 text-[12px] text-[#6c6a64]">
            {todayPercent >= 100
              ? "🛑 Budget hit — Gemini paused, OpenRouter fallback active"
              : todayPercent > 80
              ? "⚠️ Approaching daily cap"
              : "✓ Within budget"}
          </div>
        </div>

        {/* Daily chart */}
        <div className="rounded-xl border border-[#e6dfd8] bg-white p-6 mb-8">
          <h2 className="font-sans font-bold text-[15px] text-[#141413] mb-4">
            Daily spend — last 30 days
          </h2>
          {daily.length === 0 ? (
            <p className="text-[14px] text-[#6c6a64]">No usage logged yet.</p>
          ) : (
            <>
              <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto" preserveAspectRatio="none">
                <polyline
                  points={points.join(" ")}
                  fill="none"
                  stroke="#cc785c"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
                {daily.map((d, i) => {
                  const x = i * step;
                  const y = h - (d.usd / maxUsd) * (h - 10);
                  return <circle key={d.date} cx={x} cy={y} r="2" fill="#cc785c" />;
                })}
              </svg>
              <div className="mt-4 grid grid-cols-7 gap-2 text-[10px] text-[#8e8b82]">
                {daily.slice(-7).map((d) => (
                  <div key={d.date} className="text-center">
                    <div className="font-mono">{d.date.slice(5)}</div>
                    <div className="text-[#cc785c] font-bold">${d.usd.toFixed(4)}</div>
                    <div>{d.calls}c</div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <details className="rounded-xl border border-[#e6dfd8] bg-white p-6">
          <summary className="cursor-pointer font-sans font-bold text-[14px] text-[#141413]">
            ⚙️ How budget cap works
          </summary>
          <div className="mt-4 text-[13px] leading-[1.7] text-[#3d3d3a] space-y-2">
            <p>
              <strong>1.</strong> ทุก Gemini call ถูก log ลง <code>janepat_usage</code> พร้อม cost (input + output tokens × pricing)
            </p>
            <p>
              <strong>2.</strong> ก่อนเรียก Gemini ระบบเช็ค <code>getTodayCostUsd()</code> — ถ้าเกิน <code>GEMINI_DAILY_BUDGET_USD</code> (default $0.50) → skip Gemini
            </p>
            <p>
              <strong>3.</strong> Fallback ไป OpenRouter free models (gpt-oss-20b, glm-4.5-air, llama-3.3-70b, gpt-oss-120b)
            </p>
            <p>
              <strong>4.</strong> Reset ใหม่ทุกเที่ยงคืน (ตามวันที่ created ใน UTC)
            </p>
            <p className="text-[#6c6a64] mt-3">
              เปลี่ยน budget ได้ที่ Coolify env <code>GEMINI_DAILY_BUDGET_USD</code>
            </p>
          </div>
        </details>
      </div>
    </div>
  );
}

function Card({ label, value, sub, tone = "neutral" }: { label: string; value: string; sub: string; tone?: "ok" | "neutral" | "warn" }) {
  const toneClass = tone === "warn" ? "border-[#c64545]/40 bg-[#c64545]/5" : tone === "ok" ? "border-[#5db872]/40 bg-[#5db872]/5" : "border-[#e6dfd8] bg-white";
  return (
    <div className={`rounded-xl border ${toneClass} p-5`}>
      <div className="text-[11px] font-medium uppercase tracking-[1.5px] text-[#6c6a64]">{label}</div>
      <div className="mt-2 font-display text-[28px] tracking-[-0.4px] text-[#141413]">{value}</div>
      <div className="mt-1 text-[12px] text-[#6c6a64]">{sub}</div>
    </div>
  );
}
