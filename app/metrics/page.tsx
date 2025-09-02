// app/metrics/page.tsx
import { Card } from "@/components/card";

export const dynamic = "force-dynamic";

export default async function MetricsPage() {
  const r = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/api/metrics`, { cache: "no-store" }).catch(() => null);
  const data = r && r.ok ? await r.json() : null;

  return (
    <main className="mx-auto max-w-6xl px-6 py-8 space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Metrics</h1>

      {!data ? (
        <Card>Metrics unavailable.</Card>
      ) : (
        <>
          <Card title="Summary">
            <div className="grid sm:grid-cols-4 gap-3 text-sm">
              <Metric label="Trades" value={String(data.summary.trades)} />
              <Metric label="Hit Rate" value={fmtPct(data.summary.hitRate)} />
              <Metric label="Profit Factor" value={fmtNum(data.summary.profitFactor)} />
              <Metric label="Last Equity" value={fmtUsd(data.summary.lastEquity)} />
            </div>
          </Card>

          <Card title="Equity (last 100 pts)">
            <pre className="h-64 overflow-auto rounded-lg border border-white/10 bg-white/5 p-3 text-xs text-neutral-300">
{JSON.stringify((data.equityCurve ?? []).slice(-100), null, 2)}
            </pre>
          </Card>
        </>
      )}
    </main>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/5 p-3">
      <div className="text-xs text-neutral-400">{label}</div>
      <div className="font-medium">{value}</div>
    </div>
  );
}
function fmtUsd(x: number | null) { return x == null ? "—" : `$${x.toFixed(2)}`; }
function fmtNum(x: number | null) { return x == null ? "—" : x.toFixed(2); }
function fmtPct(x: number | null) { return x == null ? "—" : (x * 100).toFixed(1) + "%"; }
