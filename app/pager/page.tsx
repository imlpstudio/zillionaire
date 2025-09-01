import { Card } from "@/components/ui/card";
import { OrderTicket } from "@/components/OrderTicket";
import { ChartFrame } from "@/components/ChartFrame";


export default function PaperPage() {
return (
<main className="mx-auto max-w-7xl px-4 py-6">
<div className="grid gap-6 lg:grid-cols-3">
<Card title="Instrument">AAPL</Card>
<Card title="Position">0 shares</Card>
<Card title="Avg Price">—</Card>
</div>


<div className="mt-6 grid gap-6 lg:grid-cols-3">
<Card title="Chart" subtitle="Candles placeholder" className="lg:col-span-2">
<ChartFrame />
</Card>
<Card title="Order Ticket">
<OrderTicket />
</Card>
</div>
</main>
);
}