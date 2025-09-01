"use client";
import { useEffect, useState, useTransition } from "react";
import { Card } from "@/components/card";

type Play = { symbol:string; score:number; entry:number; stop:number; target:number; rsi:number; macdH:number; ema12:number; ema26:number; atr:number };
type Payload = { asOf:string|null; top:Play[]; all:Play[]; error?:string };

export default function PlaysPage() {
  const [data, setData] = useState<Payload|null>(null);
  const [pending, start] = useTransition();

  async function refresh() {
    const r = await fetch("/api/plays", { cache:"no-store" });
    setData(await r.json());
  }
  async function runScanNow() {
    start(async ()=>{
      await fetch("/api/scan", { method:"POST" });
      await refresh();
    });
  }
  useEffect(()=>{ refresh(); },[]);

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Top Plays</h1>
          <p className="text-sm text-neutral-400">Auto-ranked crypto candidates (1h scan). As of {data?.asOf ?? "—"}.</p>
        </div>
        <button className="btn btn-primary" onClick={runScanNow} disabled={pending}>
          {pending ? "Scanning…" : "Run Scan"}
        </button>
      </header>

      {data?.error && <Card>{data.error}</Card>}

      <section className="grid gap-6 lg:grid-cols-2">
        {data?.top?.map(p => (
          <Card key={p.symbol} title={`${p.symbol} • Score ${p.score}/100`} subtitle="Entry/stop/target are theoretical">
            <div className="grid sm:grid-cols-2 gap-3 text-sm">
              <Metric label="Entry"  value={`$ ${p.entry.toFixed(2)}`} />
              <Metric label="Stop"   value={`$ ${p.stop.toFixed(2)}`} />
              <Metric label="Target" value={`$ ${p.target.toFixed(2)}`} />
              <Metric label="ATR(14)" value={p.atr.toFixed(2)} />
              <Metric label="EMA12>EMA26" value={p.ema12>p.ema26 ? "Yes" : "No"} />
              <Metric label="MACD Hist" value={p.macdH.toFixed(4)} />
              <Metric label="RSI(14)" value={p.rsi.toFixed(1)} />
            </div>
            <p className="mt-3 text-xs text-neutral-400">Sizing rule (example): Risk 0.5% of equity using stop distance (Qty = 0.005 * Equity / (Entry-Stop)).</p>
          </Card>
        ))}
        {!data?.top?.length && <Card>No plays yet. Click “Run Scan”.</Card>}
      </section>
    </main>
  );
}

function Metric({label, value}:{label:string; value:string}) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/5 p-3">
      <div className="text-xs text-neutral-400">{label}</div>
      <div className="font-medium">{value}</div>
    </div>
  );
}
