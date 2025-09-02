import { TickerTape } from "../components/TickerPage";
import { Card } from "../components/card";
import { ChartFrame } from "../components/ChartFrame";
import { Watchlist } from "../components/Watchlist";

export default function HomePage() {
  return (
    <main className="mx-auto max-w-7xl px-3 sm:px-4">
      {/* Ticker */}
      <section className="py-3 sm:py-4">
        <TickerTape symbols={["AAPL","MSFT","NVDA","TSLA","AMZN","META","GOOGL","SPY","QQQ","BTC-USD"]} />
      </section>

      {/* Main grid */}
      <section className="grid gap-4 pb-10 sm:gap-6 lg:grid-cols-3">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          <Card title="Market Overview" subtitle="Candles placeholder — wire to real data later">
            <div className="aspect-[16/9] w-full">
              <ChartFrame />
            </div>
          </Card>

          {/* KPIs */}
          <div className="grid gap-4 sm:grid-cols-2">
            <Card title="P&L (Today)" tight>
              <KPILine value="+$1,482" sub="+2.6%" />
            </Card>
            <Card title="Quick Links" tight>
              <div className="flex flex-wrap gap-2 text-sm">
                <a href="/crypto/console" className="rounded-md bg-emerald-600/20 px-3 py-1 text-emerald-300 hover:bg-emerald-600/30">
                  Open Console
                </a>
                <a href="/paper" className="rounded-md px-3 py-1 hover:bg-white/10">Paper</a>
                <a href="/backtest" className="rounded-md px-3 py-1 hover:bg-white/10">Backtests</a>
              </div>
            </Card>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-4 sm:space-y-6">
          <Card title="Watchlist">
            <Watchlist />
          </Card>
        </div>
      </section>
    </main>
  );
}

function KPILine({ value, sub }: { value: string; sub?: string }) {
  return (
    <div>
      <div className="text-3xl font-semibold tracking-tight">{value}</div>
      {sub && <div className="mt-1 text-sm text-neutral-400">{sub}</div>}
    </div>
  );
}
