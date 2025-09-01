import { EMA, MACD, ATR } from "technicalindicators";
import type { Candle } from "./fetchCandles";

export function computeSignals(candles: Candle[]) {
  const closes = candles.map(c => c.close);
  const highs  = candles.map(c => c.high);
  const lows   = candles.map(c => c.low);

  const ema12 = EMA.calculate({ period: 12, values: closes });
  const ema26 = EMA.calculate({ period: 26, values: closes });
  const macd  = MACD.calculate({ fastPeriod:12, slowPeriod:26, signalPeriod:9, values:closes, SimpleMAOscillator:false, SimpleMASignal:false });
  const atr14 = ATR.calculate({ period:14, high:highs, low:lows, close:closes });

  const e12 = ema12.at(-1)!;
  const e26 = ema26.at(-1)!;
  const macdH = macd.at(-1)?.histogram ?? 0;
  const macdPrev = macd.at(-2)?.histogram ?? 0;
  const atr = atr14.at(-1)!;
  const price = closes.at(-1)!;

  const longSignal = e12 > e26 && macdH > 0 && macdH >= macdPrev;
  const exitSignal = e12 < e26 || macdH < 0;

  return { longSignal, exitSignal, price, atr, e12, e26, macdH };
}
