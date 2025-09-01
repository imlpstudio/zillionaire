import { Card } from "@/components/card";


export default function BacktestPage() {
return (
<main className="mx-auto max-w-7xl px-4 py-6">
<div className="grid gap-6 lg:grid-cols-2">
<Card title="Strategy" subtitle="SMA/EMA crossover (placeholder)">
<form className="grid gap-4 sm:grid-cols-2">
<label className="grid gap-1 text-sm">
<span className="text-neutral-300">Symbol</span>
<input className="input" placeholder="AAPL" defaultValue="AAPL" />
</label>
<label className="grid gap-1 text-sm">
<span className="text-neutral-300">Initial Cash</span>
<input className="input" placeholder="10000" defaultValue="10000" />
</label>
<label className="grid gap-1 text-sm">
<span className="text-neutral-300">Fast MA</span>
<input className="input" placeholder="12" defaultValue="12" />
</label>
<label className="grid gap-1 text-sm">
<span className="text-neutral-300">Slow MA</span>
<input className="input" placeholder="26" defaultValue="26" />
</label>
<button className="btn sm:col-span-2">Run Backtest</button>
</form>
</Card>
<Card title="Results" subtitle="Equity curve placeholder">
<div className="h-56 rounded-lg border border-white/10 bg-white/5" />
</Card>
</div>
</main>
);
}