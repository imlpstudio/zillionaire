"use client";
import { useEffect, useState } from "react";

type PickRow = {
  symbol: string;
  timeframe: string;
  side: "LONG"|"SHORT";
  score: number;
  edge: number;
  stakeUnits: number;
  entryPrice?: number;
  rationale?: { name:string; weight:number; contribution:number }[];
};

type Account = { currency:string; cash:number; equity:number; positions:any[] };

export default function CryptoConsolePage() {
  const [acct, setAcct] = useState<Account|null>(null);
  const [picks, setPicks] = useState<PickRow[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [status, setStatus] = useState("");

  async function loadAccount(){
    const res = await fetch("/api/ledger/account", { cache:"no-store" });
    setAcct(await res.json());
  }
  async function loadLogs(){
    const res = await fetch("/api/ledger/logs", { cache:"no-store" });
    setLogs(await res.json());
  }
  async function resetAccount(){
    await fetch("/api/ledger/account", {
      method:"POST", headers:{"Content-Type":"application/json"},
      body: JSON.stringify({ action:"reset", balance:100000 })
    });
    loadAccount(); loadLogs();
  }
  async function runScan(){
    setStatus("Scanning with indicators…");
    setPicks([
      { symbol:"BTCUSD", timeframe:"4h", side:"LONG", score:0.68, edge:0.07, stakeUnits:0.50, entryPrice:60000,
        rationale:[{name:"Trend", weight:0.35, contribution:0.24},{name:"Momentum",weight:0.35,contribution:0.18}] },
      { symbol:"ETHUSD", timeframe:"4h", side:"LONG", score:0.63, edge:0.04, stakeUnits:0.30, entryPrice:2500,
        rationale:[{name:"Breakout", weight:0.20, contribution:0.10}] },
      { symbol:"SOLUSD", timeframe:"4h", side:"SHORT", score:0.38, edge:0.03, stakeUnits:0.20, entryPrice:150,
        rationale:[{name:"Vol Filter", weight:0.10, contribution:0.10}] },
    ]);
    setStatus("Scan complete.");
  }
  async function logPick(p:PickRow){
    if (!p.entryPrice){ setStatus("Please set entry."); return; }
    setStatus("Logging trade…");
    const stake_pct = (p.stakeUnits||0)/100;
    const res = await fetch("/api/crypto/log", {
      method:"POST", headers:{"Content-Type":"application/json"},
      body: JSON.stringify({ symbol:p.symbol, side:p.side, price:p.entryPrice, stake_pct })
    });
    const data = await res.json();
    setStatus(data.ok ? `Logged ${p.symbol} ${p.side}. Cash: $${data.cash}` : `Error: ${data.error}`);
    loadAccount(); loadLogs();
  }

  useEffect(()=>{ loadAccount(); loadLogs(); runScan(); }, []);

  const pct = (x:number)=>`${(x*100).toFixed(1)}%`;

  return (
    <main className="mx-auto max-w-6xl px-3 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Crypto Console (1-2-3)</h1>
          <p className="text-xs sm:text-sm text-neutral-400">Daily: Scan → Log → Backtest. Starting bankroll = $100,000.</p>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <div className="rounded-lg border border-white/10 bg-white/5 px-3 py-2">
            <div className="text-neutral-400">Cash</div>
            <div className="font-semibold">${acct ? Math.round(acct.cash).toLocaleString() : "…"}</div>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/5 px-3 py-2">
            <div className="text-neutral-400">Equity*</div>
            <div className="font-semibold">${acct ? Math.round(acct.equity).toLocaleString() : "…"}</div>
          </div>
          <button onClick={resetAccount} className="rounded-md bg-neutral-900 hover:bg-neutral-800 px-3 py-1">Reset $100k</button>
        </div>
      </header>

      {/* 1) Scan */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">1) Scan — Ranked Picks</h2>
          <button onClick={runScan} className="px-3 py-1 rounded bg-neutral-900 hover:bg-neutral-800">Run Scan</button>
        </div>
        {status && <p className="text-sm text-neutral-400">{status}</p>}

        <div className="overflow-x-auto">
          <table className="w-full text-sm border-separate border-spacing-y-1">
            <thead className="text-neutral-300">
              <tr>
                <th className="text-left px-2">Symbol</th>
                <th className="px-2">Side</th>
                <th className="px-2">Edge</th>
                <th className="px-2">Score</th>
                <th className="px-2">Entry</th>
                <th className="px-2">Why</th>
                <th className="px-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {picks.map((p, idx)=>(
                <tr key={p.symbol+idx} className="bg-neutral-900/40">
                  <td className="px-2 py-1">{p.symbol}</td>
                  <td className="px-2 py-1">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${p.side==="LONG"?"bg-emerald-600/25 text-emerald-200":"bg-red-600/25 text-red-200"}`}>{p.side}</span>
                  </td>
                  <td className="px-2 py-1 font-semibold text-emerald-300">{pct(p.edge)}</td>
                  <td className="px-2 py-1">{pct(p.score)}</td>
                  <td className="px-2 py-1">
                    <input type="number" defaultValue={p.entryPrice ?? 0}
                      onChange={(e)=>{p.entryPrice=Number(e.target.value); setPicks([...picks]);}}
                      className="w-24 rounded bg-black/40 border border-white/10 px-2 py-1"/>
                  </td>
                  <td className="px-2 py-1">
                    <details>
                      <summary className="cursor-pointer text-xs underline">View</summary>
                      <div className="mt-1 rounded bg-black/70 p-2 space-y-1">
                        {p.rationale?.map(r=>(
                          <div key={r.name} className="flex justify-between text-xs text-neutral-300">
                            <span>{r.name} ({(r.weight*100).toFixed(0)}%)</span>
                            <span>{(r.contribution*100).toFixed(1)}%</span>
                          </div>
                        ))}
                        <div className="mt-2 h-12 rounded bg-neutral-900/50" />
                      </div>
                    </details>
                  </td>
                  <td className="px-2 py-1">
                    <button onClick={()=>logPick(p)} className="text-xs px-2 py-1 rounded bg-neutral-900 hover:bg-neutral-800">Log</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 2) Paper-trade Logs */}
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">2) Recent Logs</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-separate border-spacing-y-1">
            <thead className="text-neutral-400">
              <tr><th>Time</th><th>Symbol</th><th>Side</th><th>Qty</th><th>Price</th><th>Notional</th></tr>
            </thead>
            <tbody>
              {logs.map((l,i)=>(
                <tr key={i} className="bg-neutral-900/40">
                  <td className="px-2 py-1">{l.ts}</td>
                  <td className="px-2 py-1">{l.symbol}</td>
                  <td className="px-2 py-1">{l.side}</td>
                  <td className="px-2 py-1">{Number(l.qty).toFixed(4)}</td>
                  <td className="px-2 py-1">${Number(l.price).toFixed(2)}</td>
                  <td className="px-2 py-1">${Number(l.notional).toFixed(2)}</td>
                </tr>
              ))}
              {!logs.length && <tr><td colSpan={6} className="px-2 py-2 text-neutral-400">No trades yet.</td></tr>}
            </tbody>
          </table>
        </div>
      </section>

      {/* 3) Backtest */}
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">3) Backtest & Validate</h2>
        <p className="text-sm text-neutral-400">KPIs and equity curve coming once you plug in results feed.</p>
      </section>
    </main>
  );
}
