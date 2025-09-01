import fs from "fs";
import { computeSignals } from "./signals";
import type { Candle } from "./fetchCandles";

type Position = { entry: number; stop: number; barsHeld: number } | null;
let position: Position = null;
let barsSinceTrade = 999;

export function simulate(candles: Candle[]) {
  const closes = candles.map(c => c.close);
  const price = closes.at(-1)!;

  const { longSignal, exitSignal, atr } = computeSignals(candles);

  if (!position && longSignal && barsSinceTrade > 3) {
    position = { entry: price, stop: price - 2 * atr, barsHeld: 0 };
    barsSinceTrade = 0;
    logTrade({ side: "BUY", price });
  } else if (position) {
    position.barsHeld++;
    const exitByStop = price < position.stop;
    if (exitSignal || exitByStop) {
      const pnl = price - position.entry;
      logTrade({ side: "SELL", price, pnl });
      position = null;
      barsSinceTrade = 0;
    }
  }
  barsSinceTrade++;
}

function logTrade(trade: { side: "BUY" | "SELL"; price: number; pnl?: number }) {
  const header = "timestamp,side,price,pnl\n";
  if (!fs.existsSync("trades.csv")) fs.writeFileSync("trades.csv", header);
  const line = `${new Date().toISOString()},${trade.side},${trade.price},${trade.pnl ?? ""}\n`;
  fs.appendFileSync("trades.csv", line);
  console.log("Logged trade:", line.trim());
}
