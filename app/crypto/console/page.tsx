"use client";

import { useState } from "react";

/**
 * Crypto Console — simple 1-2-3 daily flow (UI skeleton only)
 * 1) Scan: runs indicators/math to rank symbols (placeholder)
 * 2) Log: paper-trade entries (placeholder)
 * 3) Backtest: show performance summary (placeholder)
 *
 * NOTE: We are NOT removing any indicators. Wire them into the Scan section later.
 */

type PickRow = {
  symbol: string;
  timeframe: string;
  side: "LONG" | "SHORT";
  score: number;     // 0..1 combined indicator score (placeholder)
  edge: number;      // 0..1 edge proxy (placeholder)
  stakeUnits: number;
};

export default function CryptoConsolePage() {
  const [picks, setPicks] = useState<PickRow[]>([]);
  const [status, setStatus] = useState<string>("");

  // --- Step 1: Scan (placeholder demo) ---
  async function runScan() {
    setStatus("Scanning with indicators…");
    // TODO: replace with real indicator math & data
    // Example placeholder picks:
    const demo: PickRow[] = [
      { symbol: "BTC", timeframe: "4h", side: "LONG",  score: 0.68, edge: 0.07, stakeUnits: 0.5 },
      { symbol: "ETH", timeframe: "4h", side: "LONG",  score: 0.63, edge: 0.04, stakeUnits: 0.3 },
      { symbol: "SOL", timeframe: "4h", side: "SHORT", score: 0.38, edge: 0.03, stakeUnits: 0.2 },
    ];
    setPicks(demo);
    setStatus("Scan complete. (Placeholder data)");
  }

  // --- Step 2: Log (placeholder demo) ---
  async function logPick(p: PickRow) {
    // TODO: append to CSV/DB via API.
    // For now we just show a status message.
    setStatus(`Logged paper trade: ${p.symbol} ${p.side} @ ${p.timeframe} (${(p.edge*100).toFixed(1)}% edge).`);
  }

  // --- Step 3: Backtest (placeholder demo) ---
  async function runBacktest() {
    // TODO: compute PnL/ROI/Hit/Equity with settled results.
    alert("Backtest placeholder — wire this to your data/API next.");
  }

  const pct = (x:number)=> `${(x*100).toFixed(1)}%`;

  return (
    <main className="mx-auto max-w-6xl px-6 py-10 space-y-10">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Crypto Console (Class Demo)</h1>
        <p className="text-sm text-neutral-400">
          Daily use: 1) Scan → 2) Paper-log → 3) Backtest. (Simulation only.)
        </p>
      </header>

      {/* 1) Scan */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">1) Scan — ranked picks from indicators</h2>
          <button onClick={runScan} className="px-3 py-1 rounded bg-neutral-900 hover:bg-neutral-800">
            Run Scan
          </button>
        </div>

        {status && <p className="text-sm text-neutral-400">{status}</p>}

        <div className="overflow-x-auto">
          <table className="w-full text-sm border-separate border-spacing-y-1">
            <thead className="text-neutral-300">
              <tr>
                <th className="text-left px-2">Symbol</th>
                <th className="text-left px-2">TF</th>
                <th className="text-left px-2">Side</th>
                <th className="px-2">Score</th>
                <th className="px-2">Edge</th>
                <th className="px-2">Stake</th>
                <th className="px-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {picks.map((p) => (
                <tr key={p.symbol} className="bg-neutral-900/40">
                  <td className="px-2 py-1 font-medium">{p.symbol}</td>
                  <td className="px-2 py-1">{p.timeframe}</td>
                  <td className="px-2 py-1">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold
                      ${p.side==="LONG" ? "bg-emerald-600/25 text-emerald-200" : "bg-red-600/25 text-red-200"}`}>
                      {p.side}
                    </span>
                  </td>
                  <td className="px-2 py-1">{pct(p.score)}</td>
                  <td className="px-2 py-1">+{pct(p.edge)}</td>
                  <td className="px-2 py-1">{p.stakeUnits.toFixed(2)}u</td>
                  <td className="px-2 py-1">
                    <div className="flex gap-2">
                      <button
                        className="text-xs px-2 py-1 rounded bg-neutral-900 hover:bg-neutral-800"
                        onClick={() => {
                          const csv = `date,symbol,side,timeframe,score,edge,stake_units
YYYY-MM-DD,${p.symbol},${p.side},${p.timeframe},${p.score.toFixed(3)},${p.edge.toFixed(3)},${p.stakeUnits.toFixed(2)}
`;
                          navigator.clipboard.writeText(csv);
                        }}
                      >
                        Copy row
                      </button>
                      <button
                        className="text-xs px-2 py-1 rounded bg-neutral-900 hover:bg-neutral-800"
                        onClick={() => logPick(p)}
                      >
                        Log paper bet
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!picks.length && (
                <tr>
                  <td colSpan={7} className="px-2 py-3 text-neutral-400">
                    Run Scan to generate ranked picks from your indicators.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* 2) Paper-Trade */}
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">2) Paper-trade & Log</h2>
        <p className="text-sm text-neutral-400">
          Use <b>Copy row</b> to paste into your sheet or <b>Log paper bet</b> (placeholder) to save locally once APIs are wired.
        </p>
      </section>

      {/* 3) Backtest */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">3) Backtest & Validate</h2>
          <button onClick={runBacktest} className="px-3 py-1 rounded bg-neutral-900 hover:bg-neutral-800">
            Run Backtest
          </button>
        </div>
        <p className="text-sm text-neutral-400">
          This will show ROI / Hit / Equity once you connect results data. (Skeleton only.)
        </p>
      </section>
    </main>
  );
}
