import { TickerTape } from "../components/TickerPage";
import { Card } from "../components/ui/card";
import { ChartFrame } from "../components/ChartFrame";
import { OrderTicket } from "../components/OrderTicket";
import { Watchlist } from "../components/Watchlist";


export default function HomePage() {
return (
<main className="mx-auto max-w-7xl px-4">
<section className="py-4">
<TickerTape symbols={["AAPL","MSFT","NVDA","TSLA","AMZN","META","GOOGL","SPY","QQQ","BTC-USD"]} />
</section>


<section className="grid gap-6 pb-10 lg:grid-cols-3">
<div className="lg:col-span-2 space-y-6">
<Card title="Market Overview" subtitle="Candles placeholder — wire to real data later">
<ChartFrame />
</Card>


<div className="grid gap-6 sm:grid-cols-2">
<Card title="P&L (Today)" tight>
<KPILine value="+$1,482" sub="+2.6%" />
</Card>
<Card title="Cash Available" tight>
<KPILine value="$98,520" sub="Buying power $197k" />
</Card>
</div>
</div>


<div className="space-y-6">
<Card title="Order Ticket">
<OrderTicket />
</Card>
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