// app/trades/page.tsx
import { Card } from "@/components/card";

export const dynamic = "force-dynamic";

export default async function TradesPage() {
  const r = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/api/metrics`, { cache: "no-store" }).catch(() => null);
  const data = r && r.ok ? await r.json() : null;

  return (
    <main className="mx-auto max-w-6xl px-6 py-8 space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Trade Log</h1>

      {!data ? (
        <Card>Trades unavailable.</Card>
      ) : (
        <Card>
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-white/5">
                <th className="px-2 py-1">Time</th>
                <th className="px-2 py-1">Side</th>
                <th className="px-2 py-1">Symbol</th>
                <th className="px-2 py-1">Price</th>
                <th className="px-2 py-1">Qty</th>
                <th className="px-2 py-1">PnL</th>
                <th className="px-2 py-1">Note</th>
              </tr>
            </thead>
            <tbody>
              {(data.trades ?? []).map((t: any) => (
                <tr key={t.id} className="border-t border-white/10">
                  <td className="px-2 py-1">{new Date(t.ts).toLocaleString()}</td>
                  <td className="px-2 py-1">{t.side}</td>
                  <td className="px-2 py-1">{t.symbol}</td>
                  <td className="px-2 py-1">${Number(t.price).toFixed(2)}</td>
                  <td className="px-2 py-1">{Number(t.qty).toFixed(6)}</td>
                  <td className={`px-2 py-1 ${t.pnl > 0 ? "text-emerald-400" : t.pnl < 0 ? "text-rose-400" : ""}`}>
                    {t.pnl !== null ? Number(t.pnl).toFixed(2) : ""}
                  </td>
                  <td className="px-2 py-1">{t.note ?? ""}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </main>
  );
}
