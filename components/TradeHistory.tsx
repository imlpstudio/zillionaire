
"use client";
import { useEffect, useState } from "react";
import { Card } from "@/components/card";

type Trade = {
  id: number;
  ts: string;
  symbol: string;
  side: "BUY" | "SELL";
  price: number;
  qty: number;
  pnl: number | null;
  note?: string | null;
};

type EquityPoint = { time: string; equity: number };

type Payload = {
  trades: Trade[];
  equityCurve: EquityPoint[];
  summary: {
    trades: number;
    wins: number;
    losses: number;
    profitFactor: number | null;
    hitRate: number | null; // 0..1
    lastEquity: number | null;
  };
};

export function TradeHistory() {
  const [data, setData] = useState<Payload | null>(null);

  useEffect(() => {
    (async () => {
      const r = await fetch("/api/metrics", { cache: "no-store" });
      const j = await r.json();
      setData(j);
    })();
  }, []);

  if (!data) return <Card title="Trade History">Loading…</Card>;

  return (
    <div className="space-y-6">
      <Card title="Summary" subtitle="Autonomous $1,000 account">
        <div className="grid sm:grid-cols-4 gap-3 text-sm">
          <Metric label="Trades" value={String(data.summary.trades)} />
          <Metric label="Hit Rate" value={fmtPct(data.summary.hitRate)} />
          <Metric label="Profit Factor" value={fmtNum(data.summary.profitFactor)} />
          <Metric label="Last Equity" value={fmtUsd(data.summary.lastEquity)} />
        </div>
      </Card>

      <Card title="Equity (latest 50 points)">
        <div className="h-52 rounded-lg border border-white/10 bg-white/5 p-3 overflow-x-auto">
          <pre className="text-xs text-neutral-300 whitespace-pre">
{JSON.stringify(data.equityCurve.slice(-50), null, 2)}
          </pre>
        </div>
      </Card>

      <Card title="Trades">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-white/5 text-neutral-300">
              <th className="px-2 py-1">Time</th>
              <th className="px-2 py-1">Side</th>
              <th className="px-2 py-1">Symbol</th>
              <th className="px-2 py-1">Price</th>
              <th className="px-2 py-1">Qty</th>
              <th className="px-2 py-1">PnL</th>
              <th className="px-2 py-1">Note</th>
            </tr>
          </thead>
          <tbody>
            {data.trades.map((t) => (
              <tr key={t.id} className="border-t border-white/10">
                <td className="px-2 py-1">{new Date(t.ts).toLocaleString()}</td>
                <td className="px-2 py-1">{t.side}</td>
                <td className="px-2 py-1">{t.symbol}</td>
                <td className="px-2 py-1">${t.price.toFixed(2)}</td>
                <td className="px-2 py-1">{t.qty.toFixed(6)}</td>
                <td className={`px-2 py-1 ${t.pnl ? (t.pnl > 0 ? "text-emerald-400" : "text-rose-400") : ""}`}>
                  {t.pnl !== null ? t.pnl.toFixed(2) : ""}
                </td>
                <td className="px-2 py-1">{t.note ?? ""}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
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
