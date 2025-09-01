import { Card } from "@/components/card";
import { Watchlist } from "@/components/Watchlist";


export default function WatchlistPage() {
return (
<main className="mx-auto max-w-7xl px-4 py-6">
<Card title="Watchlist">
<Watchlist />
</Card>
</main>
);
}