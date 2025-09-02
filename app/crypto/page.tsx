export default function CryptoLanding() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-10 space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Crypto</h1>
      <p className="text-sm text-neutral-400">
        Daily 1-2-3 flow for class: Scan → Paper-log → Backtest. Indicators stay intact; we’ll wire them in the console.
      </p>
      <ul className="list-disc pl-5 space-y-2 text-neutral-300">
        <li>
          <a href="/crypto/console" className="underline">Open Crypto Console (Scan → Log → Backtest)</a>
        </li>
        <li className="text-neutral-500">
          Advanced views (optional): Positions, Metrics, Watchlist, etc. — keep them, but not required for daily demo.
        </li>
      </ul>
    </main>
  );
}
