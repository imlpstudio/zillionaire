import { Card } from "@/components/card";

export const metadata = { title: "Validation Plan" };

export default function ValidationPlanPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-8 space-y-6">
      <h1 className="text-3xl font-semibold tracking-tight">Strategy Validation Plan</h1>

      <Card title="0) Pre-commit (avoid hindsight bias)">
        <ul className="list-disc pl-5 text-sm text-neutral-300 space-y-2">
          <li>Pre-register exact rules (entries/exits/sizing) and tag the repo (e.g., <code>v0.9-pretrial</code>).</li>
          <li>Freeze data provider/version; document fees, slippage, funding (for perps).</li>
        </ul>
      </Card>

      <Card title="1) Empirical Validation (backtest/out-of-sample)">
        <ul className="list-disc pl-5 text-sm text-neutral-300 space-y-2">
          <li>Time-series split: in-sample 60–70%, validation 15–20%, out-of-sample 15–20%.</li>
          <li>Walk-forward test; stitch OOS segments.</li>
          <li>Metrics: Sharpe ≥ 1.0, Sortino ≥ 1.2, PF ≥ 1.2, MaxDD ≤ 25%, Calmar ≥ 0.4.</li>
          <li>Overfitting checks: sensitivity heatmaps, Deflated Sharpe, SPA/Reality Check, Monte-Carlo equity cones.</li>
          <li>Regime robustness: bull, chop, crash slices.</li>
        </ul>
      </Card>

      <Card title="2) Paper Trading (live sim)">
        <ul className="list-disc pl-5 text-sm text-neutral-300 space-y-2">
          <li>Run 4–8 weeks 24/7 with real quotes; log slippage vs assumptions, rejects, outages.</li>
          <li>Pass if Sharpe ≥ 0.7, PF ≥ 1.1, MaxDD within +10% of backtest OOS; ops error &lt; 2% orders.</li>
        </ul>
      </Card>

      <Card title="3) Pilot With Tiny Capital">
        <ul className="list-disc pl-5 text-sm text-neutral-300 space-y-2">
          <li>Start with 0.5–1.0% of intended capital; no leverage initially.</li>
          <li>Risk with ATR or vol targeting; daily loss cap; kill-switch at DD thresholds.</li>
          <li>Pass if real PF ≥ 1.15, Sharpe ≥ 0.7, tracking error vs paper/backtest ≤ 25%.</li>
        </ul>
      </Card>

      <Card title="Deliverables (for class & repo)">
        <ol className="list-decimal pl-5 text-sm text-neutral-300 space-y-2">
          <li>Methodology brief (rules, data, slippage/fees).</li>
          <li>Validation report (equity/DD, rolling Sharpe, sensitivity, OOS, regime slices, overfit tests).</li>
          <li>Operations appendix (latency, order types, failure handling, audit trail).</li>
          <li>Go-live plan (paper criteria, pilot size, kill-switch, monitoring).</li>
          <li>One-page summary with acceptance criteria & results.</li>
        </ol>
      </Card>
    </main>
  );
}
