"use client";
import { useEffect, useState } from "react";

type PickRow = {
  symbol: string; name?: string; timeframe: string; side: "LONG"|"SHORT";
  score: number; edge: number; confidence: number;
  entry: number; stop: number; target: number;
  horizonHrs: number; expiresAt: string; stakeUnits: number;
  rationale?: { name:string; weight:number; contribution:number }[];
  entryPrice?: number;
};

type Account = { currency:string; cash:number; equity:number; positions:any[] };

export default function CryptoConsolePage() {
  const [acct, setAcct] = useState<Account|null>(null);
  const [picks, setPicks] = useState<PickRow[]>([]);
  const [snapshots, setSnapshots] = useState<{file:string,path:string}[]>([]);
  const [bt, setBt] = useState<any>(null);
  const [status, setStatus] = useState("");

  async function refreshAccount(){ const r=await fetch("/api/ledger/account",{cache:"no-store"}); setAcct(await r.json()); }
  async function refreshSnapshots(){ const r=await fetch("/api/crypto/scan",{cache:"no-store"}); setSnapshots(await r.json()); }
  async function refreshBacktest(){ const r=await fetch("/api/backtest",{cache:"no-store"}); setBt(await r.json()); }
  async function resetAccount(){
    await fetch("/api/ledger/account",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({action:"reset",balance:100000})});
    await refreshAccount(); await refreshBacktest();
  }
  async function markToMarket(){ await fetch("/api/ledger/mtm",{method:"POST"}); await refreshAccount(); await refreshBacktest(); }

  async function runScan(){
    setStatus("Scanning…");
    const res = await fetch("/api/crypto/scan",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({ timeframe:"4h", edge_threshold:0.02 })});
    const data = await res.json();
    setPicks(data.picks || []);
    setStatus(`Scan saved: ${data.saved}`);
    await refreshSnapshots();
  }

  async function logPick(p: PickRow){
    if (!p.entry) { setStatus("Missing entry"); return; }
    setStatus("Logging…");
    const stake_pct = (p.stakeUnits||0)/100; // 1u = 1% equity
    const res = await fetch("/api/crypto/log",{
      method:"POST",headers:{"Content-Type":"application/json"},
      body: JSON.stringify({ symbol:p.symbol, side:p.side, price:p.entry, stake_pct })
    });
    const j = await res.json();
    setStatus(j.ok ? `Logged ${p.symbol} ${p.side}. Cash $${j.cash}` : `Error: ${j.error}`);
    await refreshAccount(); await refreshBacktest();
  }

  useEffect(()=>{ refreshAccount(); refreshSnapshots(); refreshBacktest(); runScan(); }, []);

  const pct = (x:number)=> `${(x*100).toFixed(1)}%`;

  return (
    <main className="mx-auto max-w-6xl px-3 sm:px-6 py-8 space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Crypto Console (1-2-3)</h1>
          <p className="text-xs sm:text-sm text-neutral-400">Daily: Scan → Log → Backtest • Starting bankroll $100,000</p>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <div className="rounded-lg border border-white/10 bg-white/5 px-3 py-2">
            <div className="text-neutral-400">Cash</div>
            <div className="font-semibold">${acct ? Math.round(acct.cash).toLocaleString() : "…"}</div>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/5 px-3 py-2">
            <div className="text-neutral-400">Equity (MTM)</div>
            <div className="font-semibold">${acct ? Math.round(acct.equity).toLocaleString() : "…"}</div>
          </div>
          <button onClick={markToMarket} className="rounded-md bg-neutral-900 hover:bg-neutral-800 px-3 py-1">Refresh MTM</button>
          <button onClick={resetAccount} className="rounded-md bg-neutral-900 hover:bg-neutral-800 px-3 py-1">Reset $100k</button>
        </div>
      </header>

      {/* 1) Scan */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">1) Scan — ranked picks</h2>
          <button onClick={runScan} className="px-3 py-1 rounded bg-neutral-900 hover:bg-neutral-800">Run Scan</button>
        </div>
        {status && <p className="text-sm text-neutral-400">{status}</p>}
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-separate border-spacing-y-1">
            <thead className="text-neutral-300">
              <tr>
                <th className="text-left px-2">Asset</th>
                <th className="px-2">Side</th>
                <th className="px-2">Edge</th>
                <th className="px-2">Score</th>
                <th className="px-2">Conf.</th>
                <th className="px-2">Entry</th>
                <th className="px-2">Stop</th>
                <th className="px-2">Target</th>
                <th className="px-2">Stake (u)</th>
                <th className="px-2">Why</th>
                <th className="px-2">Log</th>
              </tr>
            </thead>
            <tbody>
              {picks.map((p, i)=>(
                <tr key={p.symbol+i} className="bg-neutral-900/40">
                  <td className="px-2 py-1">{p.symbol}</td>
                  <td className="px-2 py-1">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${p.side==="LONG"?"bg-emerald-600/25 text-emerald-200":"bg-red-600/25 text-red-200"}`}>{p.side}</span>
                  </td>
                  <td className="px-2 py-1 font-semibold text-emerald-300">{pct(p.edge)}</td>
                  <td className="px-2 py-1">{pct(p.score)}</td>
                  <td className="px-2 py-1">{pct(p.confidence)}</td>
                  <td className="px-2 py-1">{p.entry}</td>
                  <td className="px-2 py-1">{p.stop}</td>
                  <td className="px-2 py-1">{p.target}</td>
                  <td className="px-2 py-1">{p.stakeUnits.toFixed(2)}u</td>
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
              {!picks.length && <tr><td colSpan={11} className="px-2 py-3 text-neutral-400">No edges ≥2%.</td></tr>}
            </tbody>
          </table>
        </div>
        <div className="text-xs text-neutral-500">Scan snapshots:</div>
        <ul className="text-xs text-neutral-300 list-disc pl-5">
          {snapshots.map(s=> <li key={s.file}><code>{s.file}</code></li>)}
          {!snapshots.length && <li>No snapshots yet.</li>}
        </ul>
      </section>

      {/* 2) Paper-trade note */}
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">2) Log paper trades</h2>
        <p className="text-sm text-neutral-400">“Log” books cash & positions in the local ledger. Use “Refresh MTM” after updating prices in <code>backend/marks/last_prices.csv</code>.</p>
      </section>

      {/* 3) Backtest */}
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">3) Backtest & Validate</h2>
        {bt?.summary ? (
          <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm grid gap-2 sm:grid-cols-3">
            <div><div className="text-neutral-400">Equity (MTM)</div><div className="font-semibold">${bt.summary.equity}</div></div>
            <div><div className="text-neutral-400">ROI</div><div className="font-semibold">{bt.summary.roi_pct}%</div></div>
            <div><div className="text-neutral-400">Trades Logged</div><div className="font-semibold">{bt.summary.trades_logged}</div></div>
          </div>
        ) : <p className="text-sm text-neutral-400">No stats yet.</p>}
      </section>
    </main>
  );
}
