// app/(secret)/secret/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";

type PickRow = {
  date: string;
  league: string;
  game_id: string;
  home: string;
  away: string;
  side: "home" | "away";
  edge: number;             // 0.0–1.0 (e.g., 0.032 = 3.2%)
  decimal_odds: number;
  model_prob: number;       // 0.0–1.0
  stake_units: number;
  copy_line: string;        // CSV line to copy or paste
};

type BacktestSummary = {
  bets_settled: number;
  staked_units: number;
  pnl_units: number;
  roi_pct: number;
  hit_rate_pct: number;
  avg_clv_pct: number;
};

export default function SecretPage() {
  const [picks, setPicks] = useState<PickRow[]>([]);
  const [status, setStatus] = useState("");
  const [report, setReport] = useState<BacktestSummary | null>(null);
  const [loadingScan, setLoadingScan] = useState(false);
  const [loadingBacktest, setLoadingBacktest] = useState(false);

  const totalStake = useMemo(
    () => picks.reduce((s, p) => s + p.stake_units, 0),
    [picks]
  );

  async function runScan() {
    setLoadingScan(true);
    setStatus("Scanning…");
    try {
      const res = await fetch("/api/trading/scan", { cache: "no-store" });
      const data = await res.json();
      const arr: PickRow[] = data?.picks ?? [];
      setPicks(arr);
      setStatus(
        arr.length
          ? `Found ${arr.length} pick${arr.length > 1 ? "s" : ""} with ≥ 2% edge`
          : "No edges today (threshold = 2%)."
      );
    } catch (e: any) {
      setStatus(`Scan error: ${e.message ?? e}`);
    } finally {
      setLoadingScan(false);
    }
  }

  async function logPick(p: PickRow) {
    setStatus("Logging bet…");
    try {
      const body = {
        date: p.date,
        league: p.league,
        game_id: p.game_id,
        selection: p.side,
        decimal_odds: p.decimal_odds,
        model_prob: p.model_prob,
        stake_units: p.stake_units,
        notes: "paper",
      };
      const res = await fetch("/api/trading/log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      setStatus(data.ok ? `Logged bet ${data.bet_id}` : `Error: ${data.error}`);
    } catch (e: any) {
      setStatus(`Log error: ${e.message ?? e}`);
    }
  }

  async function runBacktest() {
    setLoadingBacktest(true);
    setStatus("Backtesting…");
    try {
      const res = await fetch("/api/trading/backtest", { cache: "no-store" });
      const data = await res.json();
      setReport(data?.summary ?? null);
      setStatus("");
    } catch (e: any) {
      setStatus(`Backtest error: ${e.message ?? e}`);
    } finally {
      setLoadingBacktest(false);
    }
  }

  function pct(x: number) {
    return `${(x * 100).toFixed(1)}%`;
  }

  function dlCSV() {
    if (!picks.length) return;
    const header =
      "date,league,game_id,selection,decimal_odds,model_prob,stake_units\n";
    const body = picks.map((p) => p.copy_line).join("\n");
    const blob = new Blob([header + body + "\n"], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `todays_picks.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  useEffect(() => {
    runScan();
  }, []);

  return (
    <main className="mx-auto max-w-6xl px-6 py-10 space-y-10">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Math Betting — Class Demo
        </h1>
        <p className="text-sm text-neutral-400">
          Simulation only (paper trading). No real wagering.
        </p>
      </header>

      {/* Step 1: Scan */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            1) Scan — Recommended Picks Today
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={runScan}
              disabled={loadingScan}
              className="px-3 py-1 rounded bg-neutral-900 hover:bg-neutral-800 disabled:opacity-60"
            >
              {loadingScan ? "Scanning…" : "Re-scan"}
            </button>
            <button
              onClick={dlCSV}
              disabled={!picks.length}
              className="px-3 py-1 rounded bg-neutral-900 hover:bg-neutral-800 disabled:opacity-60"
            >
              Download CSV
            </button>
          </div>
        </div>

        <div
          className={`rounded-xl border border-neutral-800 p-4 ${
            picks.length ? "bg-neutral-900/30" : "bg-neutral-900/20"
          }`}
        >
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
            <span className="text-neutral-300">
              {status || "Ready."}
            </span>
            {!!picks.length && (
              <>
                <span className="text-neutral-500">•</span>
                <span className="text-neutral-300">
                  Sum suggested stake:{" "}
                  <b>{totalStake.toFixed(2)}u</b>
                </span>
                <span className="text-neutral-500">•</span>
                <span className="text-neutral-300">
                  Threshold: <b>edge ≥ 2%</b> (adjust in API if needed)
                </span>
              </>
            )}
          </div>

          {/* Picks list */}
          <div className="mt-4 grid gap-3">
            {picks.map((p) => {
              const edgePct = p.edge * 100;
              const edgeTone =
                edgePct >= 6 ? "bg-emerald-700/30 text-emerald-200" :
                edgePct >= 4 ? "bg-emerald-600/25 text-emerald-200" :
                "bg-emerald-500/20 text-emerald-100";

              return (
                <div
                  key={p.game_id + p.side}
                  className="rounded-lg border border-neutral-800 bg-neutral-950/60 p-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div className="space-y-1">
                      <div className="text-sm text-neutral-400">
                        {p.date} • {p.league} • <span className="font-mono">{p.game_id}</span>
                      </div>
                      <div className="text-base font-medium">
                        {p.home} <span className="text-neutral-500">vs</span> {p.away}
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span
                          className={`px-2 py-0.5 rounded-full font-semibold ${
                            p.side === "home"
                              ? "bg-blue-600/25 text-blue-200"
                              : "bg-purple-600/25 text-purple-200"
                          }`}
                          title="Recommended side"
                        >
                          {p.side.toUpperCase()}
                        </span>

                        <span
                          className={`px-2 py-0.5 rounded-full ${edgeTone}`}
                          title="Model edge over fair odds"
                        >
                          +{edgePct.toFixed(1)}% edge
                        </span>

                        <span className="text-neutral-300">
                          Odds: <b>{p.decimal_odds.toFixed(3)}</b>
                        </span>
                        <span className="text-neutral-300">
                          p(model): <b>{pct(p.model_prob)}</b>
                        </span>
                        <span className="text-neutral-300">
                          Stake: <b>{p.stake_units.toFixed(2)}u</b>
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-auto">
                      <button
                        className="text-xs px-3 py-1 rounded bg-neutral-900 hover:bg-neutral-800"
                        onClick={() => navigator.clipboard.writeText(p.copy_line)}
                        title="Copy CSV row for spreadsheet"
                      >
                        Copy row
                      </button>
                      <button
                        className="text-xs px-3 py-1 rounded bg-neutral-900 hover:bg-neutral-800"
                        onClick={() => logPick(p)}
                        title="Append to backend/data/bets.csv"
                      >
                        Log paper bet
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            {!picks.length && (
              <div className="text-sm text-neutral-400">
                No picks with sufficient edge. Re-scan later when odds move.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Step 2: Paper trade explanation */}
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">2) Paper trade — copy or log</h2>
        <p className="text-sm text-neutral-400">
          Click <b>Copy row</b> to paste into your spreadsheet, or <b>Log paper bet</b> to append directly to{" "}
          <code>backend/data/bets.csv</code>.
        </p>
      </section>

      {/* Step 3: Backtest */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">3) Backtest & Validate</h2>
          <button
            onClick={runBacktest}
            disabled={loadingBacktest}
            className="px-3 py-1 rounded bg-neutral-900 hover:bg-neutral-800 disabled:opacity-60"
          >
            {loadingBacktest ? "Running…" : "Run Backtest"}
          </button>
        </div>

        {report && (
          <div className="rounded-xl border border-neutral-800 bg-neutral-900/30 p-4 text-sm">
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <span className="text-neutral-400">Bets settled</span>
                <div className="font-semibold">{report.bets_settled}</div>
              </div>
              <div>
                <span className="text-neutral-400">Units staked</span>
                <div className="font-semibold">{report.staked_units}</div>
              </div>
              <div>
                <span className="text-neutral-400">PNL (u)</span>
                <div className={`font-semibold ${report.pnl_units >= 0 ? "text-emerald-300" : "text-red-300"}`}>
                  {report.pnl_units}
                </div>
              </div>
              <div>
                <span className="text-neutral-400">ROI</span>
                <div className={`font-semibold ${report.roi_pct >= 0 ? "text-emerald-300" : "text-red-300"}`}>
                  {report.roi_pct}%
                </div>
              </div>
              <div>
                <span className="text-neutral-400">Hit rate</span>
                <div className="font-semibold">{report.hit_rate_pct}%</div>
              </div>
              <div>
                <span className="text-neutral-400">Avg CLV</span>
                <div className={`font-semibold ${report.avg_clv_pct >= 0 ? "text-emerald-300" : "text-red-300"}`}>
                  {report.avg_clv_pct}%
                </div>
              </div>
            </div>
            <p className="mt-3 text-neutral-400">
              To settle more, paste game outcomes + closing odds into{" "}
              <code>backend/data/results.csv</code> and re-run.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
