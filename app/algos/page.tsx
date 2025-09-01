import { ExperimentTable } from "@/components/ExperimentTable";
import { Card } from "@/components/card";
import { TradeHistory } from "@/components/TradeHistory";



export const metadata = { title: "Algorithm Experiments" };

export default function AlgosPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-8 space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Algorithm Experiments</h1>
        <p className="text-sm text-neutral-400">
          Draft, test, and promote strategies from idea → backtest → paper → pilot → done. (Local-only log)
        </p>
      </header>
      <TradeHistory />
      <Card subtitle="Tip: document acceptance thresholds (Sharpe, PF, MaxDD) before running."></Card>
      <ExperimentTable />
    </main>
  );
}
