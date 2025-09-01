export function Watchlist() {
const rows = [
{ s: "AAPL", l: 214.22, c: +0.62 },
{ s: "NVDA", l: 118.04, c: -1.33 },
{ s: "TSLA", l: 248.18, c: +0.40 },
{ s: "AMZN", l: 182.91, c: +0.18 },
{ s: "SPY", l: 560.31, c: -0.25 },
];
return (
<table className="w-full text-sm">
<thead className="text-neutral-400">
<tr className="border-b border-white/10">
<th className="py-2 text-left font-medium">Symbol</th>
<th className="py-2 text-right font-medium">Last</th>
<th className="py-2 text-right font-medium">Change</th>
</tr>
</thead>
<tbody>
{rows.map(r => (
<tr key={r.s} className="border-b border-white/5 hover:bg-white/5">
<td className="py-2 font-mono">{r.s}</td>
<td className="py-2 text-right">{r.l.toFixed(2)}</td>
<td className={`py-2 text-right ${r.c >= 0 ? "text-emerald-400" : "text-rose-400"}`}>{r.c >= 0 ? "+" : ""}{r.c.toFixed(2)}%</td>
</tr>
))}
</tbody>
</table>
);
}