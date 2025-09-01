// app/indicators/page.tsx
import { Card } from "@/components/card";

export const metadata = {
  title: "Trading Indicators (Private)",
};

export default function IndicatorsPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-6 space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">IMLP Core Indicators</h1>
        <p className="text-sm text-neutral-400">
          Draft notes outlining the signals that will power the first-gen algorithm. (Private)
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card
          title="1) Regime Filter — 200D SMA & 20D/50D Slope"
          subtitle="Trade long only when trend + breadth confirm"
        >
          <ul className="list-disc pl-5 text-sm text-neutral-300 space-y-2">
            <li>
              <span className="font-medium">Signal:</span> Price above 200D SMA and 20D/50D SMA slopes positive.
            </li>
            <li>
              <span className="font-medium">Why:</span> Avoids fighting higher-timeframe downtrends; reduces whipsaws.
            </li>
            <li>
              <span className="font-medium">Use:</span> Gate entries; disable longs when below 200D or slopes negative.
            </li>
          </ul>
        </Card>

        <Card
          title="2) Momentum — 12/26 EMA Cross + MACD Histogram"
          subtitle="Capture medium swings with confirmation"
        >
          <ul className="list-disc pl-5 text-sm text-neutral-300 space-y-2">
            <li>
              <span className="font-medium">Signal:</span> 12EMA &gt; 26EMA, MACD hist rising 3+ bars.
            </li>
            <li>
              <span className="font-medium">Why:</span> EMA reacts faster than SMA; histogram confirms impulse strength.
            </li>
            <li>
              <span className="font-medium">Use:</span> Entry trigger when regime filter is ON; exit when cross down + hist &lt; 0.
            </li>
          </ul>
        </Card>

        <Card
          title="3) Mean Reversion — Bollinger Bands (20, 2σ)"
          subtitle="Fade extremes inside uptrends only"
        >
          <ul className="list-disc pl-5 text-sm text-neutral-300 space-y-2">
            <li>
              <span className="font-medium">Signal:</span> Touch/loss of lower band within overall uptrend.
            </li>
            <li>
              <span className="font-medium">Why:</span> Volatility envelopes frame pullbacks; buy-the-dip bias when trend intact.
            </li>
            <li>
              <span className="font-medium">Use:</span> Scale-in near lower band; trim near upper band or when RSI&gt;70.
            </li>
          </ul>
        </Card>

        <Card
          title="4) RSI (14) with Dynamic Zones"
          subtitle="Momentum overbought/oversold with trend context"
        >
          <ul className="list-disc pl-5 text-sm text-neutral-300 space-y-2">
            <li>
              <span className="font-medium">Signal:</span> RSI crosses up through 40–50 in uptrends; down through 50–60 in downtrends.
            </li>
            <li>
              <span className="font-medium">Why:</span> RSI ranges shift by regime; dynamic zones reduce false signals.
            </li>
            <li>
              <span className="font-medium">Use:</span> Filter/confirm entries; earlier exits on RSI failure to reclaim 50.
            </li>
          </ul>
        </Card>

        <Card title="5) VWAP (Session & Anchored)" subtitle="Institutional reference price">
          <ul className="list-disc pl-5 text-sm text-neutral-300 space-y-2">
            <li>
              <span className="font-medium">Signal:</span> Pullback to session VWAP in uptrend; reclaim of anchored VWAP from swing high.
            </li>
            <li>
              <span className="font-medium">Why:</span> Many funds benchmark liquidity at VWAP; powerful S/R.
            </li>
            <li>
              <span className="font-medium">Use:</span> Intraday adds; bias flips on multiple timeframe VWAP reclaims/losses.
            </li>
          </ul>
        </Card>

        <Card title="6) Volume — OBV & Volume Spike Filter" subtitle="Validate moves with participation">
          <ul className="list-disc pl-5 text-sm text-neutral-300 space-y-2">
            <li>
              <span className="font-medium">Signal:</span> OBV making HH/HLs; breakout days with 1.5–2× average volume.
            </li>
            <li>
              <span className="font-medium">Why:</span> Price without volume is fragile; OBV smooths accumulation.
            </li>
            <li>
              <span className="font-medium">Use:</span> Require elevated volume on breakout entries; avoid low-liquidity chops.
            </li>
          </ul>
        </Card>

        <Card
          title="7) Volatility — ATR for Stops & Position Sizing"
          subtitle="Normalize risk across symbols"
        >
          <ul className="list-disc pl-5 text-sm text-neutral-300 space-y-2">
            <li>
              <span className="font-medium">Signal:</span> Use 1.5–2.5× ATR for initial stops depending on regime.
            </li>
            <li>
              <span className="font-medium">Why:</span> Vol-aware stops reduce random stop-outs and standardize risk.
            </li>
            <li>
              <span className="font-medium">Use:</span> Size = (risk $ per trade) / (stop distance). Trail by rising ATR or swing lows.
            </li>
          </ul>
        </Card>

        <Card
          title="8) Market Breadth & Risk-On/Off"
          subtitle="SPY/QQQ trend + advance/decline + HYG vs IEF"
        >
          <ul className="list-disc pl-5 text-sm text-neutral-300 space-y-2">
            <li>
              <span className="font-medium">Signal:</span> Risk-on when QQQ&gt;50D, HYG outperforming IEF, and A/D above 0.
            </li>
            <li>
              <span className="font-medium">Why:</span> System-level tailwinds improve win rate and RR.
            </li>
            <li>
              <span className="font-medium">Use:</span> Throttle exposure (0–100%) via a composite breadth score.
            </li>
          </ul>
        </Card>
      </div>

      <Card title="Execution Rules (Draft)" subtitle="How the indicators translate into actions">
        <ol className="list-decimal pl-5 text-sm text-neutral-300 space-y-2">
          <li>Trade long only when the Regime Filter is ON; otherwise hold cash or hedge.</li>
          <li>Primary entries from Momentum (EMA cross + MACD); secondary adds on VWAP pullbacks.</li>
          <li>Stops placed at 2× ATR from entry; reduce risk to breakeven after +1R.</li>
          <li>Scale out into strength near upper Bollinger or RSI&gt;70, retain runners while MACD hist rising.</li>
          <li>Cap portfolio risk by breadth score; e.g., 30% exposure when neutral, 80–100% when risk-on.</li>
        </ol>
      </Card>
    </main>
  );
}
