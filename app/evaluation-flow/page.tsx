"use client";

import { Card } from "@/components/card";

export default function EvaluationFlowPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-10 space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-white">
          Evaluation Flow
        </h1>
        <p className="text-sm text-neutral-400">
          How the IMLP Core Indicators engine processes signals each day.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        <Card title="1. Regime Filter" subtitle="200D SMA + slopes">
          <ul className="list-disc pl-5 space-y-1 text-sm text-neutral-300">
            <li>Price above 200D SMA + 20/50D slopes positive = bullish regime.</li>
            <li>Bearish → no new longs, hold cash or hedge.</li>
          </ul>
        </Card>

        <Card title="2. Momentum" subtitle="EMA cross + MACD">
          <ul className="list-disc pl-5 space-y-1 text-sm text-neutral-300">
            <li>12EMA &gt; 26EMA + MACD hist rising → go long.</li>
            <li>Cross down + hist &lt; 0 → exit.</li>
          </ul>
        </Card>

        <Card title="3. Mean Reversion" subtitle="Bollinger + RSI">
          <ul className="list-disc pl-5 space-y-1 text-sm text-neutral-300">
            <li>Dip to lower Bollinger in uptrend → scale in.</li>
            <li>RSI crosses up through 40–50 confirms rebound.</li>
            <li>Trim near upper band or RSI &gt; 70.</li>
          </ul>
        </Card>

        <Card title="4. VWAP Anchors" subtitle="Session & Anchored">
          <ul className="list-disc pl-5 space-y-1 text-sm text-neutral-300">
            <li>Pullback to session VWAP in uptrend → add.</li>
            <li>Losing VWAP → reduce risk.</li>
          </ul>
        </Card>

        <Card title="5. Volume Filter" subtitle="OBV + spikes">
          <ul className="list-disc pl-5 space-y-1 text-sm text-neutral-300">
            <li>OBV trending higher.</li>
            <li>Breakouts must have 1.5–2× average volume.</li>
          </ul>
        </Card>

        <Card title="6. Volatility / Risk" subtitle="ATR stops + sizing">
          <ul className="list-disc pl-5 space-y-1 text-sm text-neutral-300">
            <li>Stops = 1.5–2.5× ATR.</li>
            <li>Position size = risk ÷ stop distance.</li>
            <li>Trail upward with ATR or swing lows.</li>
          </ul>
        </Card>

        <Card title="7. Breadth Throttle" subtitle="Risk-on/off">
          <ul className="list-disc pl-5 space-y-1 text-sm text-neutral-300">
            <li>Composite: QQQ trend, HYG vs IEF, Advance/Decline.</li>
            <li>Risk-off → throttle exposure to ~30%.</li>
            <li>Risk-on → allow 100% allocation.</li>
          </ul>
        </Card>

        <Card title="8. Execution Rules" subtitle="How it ties together">
          <ol className="list-decimal pl-5 space-y-1 text-sm text-neutral-300">
            <li>Regime filter is the master ON/OFF.</li>
            <li>Momentum = main entry/exit.</li>
            <li>Mean reversion = tactical adds/trims.</li>
            <li>VWAP = intraday refinement.</li>
            <li>All filtered by volume, ATR, breadth.</li>
          </ol>
        </Card>
      </div>
    </main>
  );
}
