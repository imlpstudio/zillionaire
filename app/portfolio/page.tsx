import { Card } from "@/components/ui/card";


export default function PortfolioPage() {
return (
<main className="mx-auto max-w-7xl px-4 py-6">
<div className="grid gap-6 lg:grid-cols-3">
<Card title="Equity" tight>
<div className="text-3xl font-semibold">$100,000</div>
<div className="mt-1 text-sm text-neutral-400">P&L +$0 (placeholder)</div>
</Card>
<Card title="Open Positions" className="lg:col-span-2">
<table className="w-full text-sm">
<thead className="text-neutral-400">
<tr className="border-b border-white/10">
<th className="py-2 text-left font-medium">Symbol</th>
<th className="py-2 text-right font-medium">Qty</th>
<th className="py-2 text-right font-medium">Avg Price</th>
<th className="py-2 text-right font-medium">P&L</th>
</tr>
</thead>
<tbody>
<tr className="border-b border-white/5">
<td className="py-2">AAPL</td>
<td className="py-2 text-right">0</td>
<td className="py-2 text-right">—</td>
<td className="py-2 text-right">—</td>
</tr>
</tbody>
</table>
</Card>
</div>
</main>
);
}