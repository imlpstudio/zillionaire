import { EMA, MACD, RSI, ATR } from "technicalindicators";

type Candle = { t:number; o:number; h:number; l:number; c:number; v:number };
type Play = {
  symbol: string;
  score: number;
  entry: number;
  stop: number;
  target: number;
  rsi: number;
  macdH: number;
  ema12: number;
  ema26: number;
  atr: number;
};

async function fetchCandles(symbol: string, interval = "1h", limit = 300): Promise<Candle[]> {
  const res = await fetch(`https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`);
  if (!res.ok) throw new Error(`Fetch candles failed for ${symbol}`);
  const rows = await res.json();
  return (rows as any[]).map(d => ({ t:d[0], o:+d[1], h:+d[2], l:+d[3], c:+d[4], v:+d[5] }));
}

function scoreOne(candles: Candle[]): Play | null {
  const closes = candles.map(x=>x.c), highs=candles.map(x=>x.h), lows=candles.map(x=>x.l);
  if (closes.length < 100) return null;

  const ema12 = EMA.calculate({ period:12, values:closes });
  const ema26 = EMA.calculate({ period:26, values:closes });
  const macd  = MACD.calculate({ fastPeriod:12, slowPeriod:26, signalPeriod:9, values:closes, SimpleMAOscillator:false, SimpleMASignal:false });
  const rsi14 = RSI.calculate({ period:14, values:closes });
  const atr14 = ATR.calculate({ period:14, high:highs, low:lows, close:closes });

  const e12 = ema12.at(-1)!; const e26 = ema26.at(-1)!;
  const rsi = rsi14.at(-1)!; const atr = atr14.at(-1)!;
  const macdH = macd.at(-1)?.histogram ?? 0;
  const macdHprev = macd.at(-2)?.histogram ?? 0;
  const c = closes.at(-1)!;

  let s = 0;
  if (e12 > e26) s += 35;
  if (macdH > 0 && macdH >= macdHprev) s += 35;
  if (rsi > 45 && rsi < 70) s += 20;
  const pullback = Math.abs((c - e12) / Math.max(1e-9, e12));
  if (pullback < 0.01) s += 10;

  return {
    symbol: "", score: Math.round(s),
    entry: c, stop: c - 2 * atr, target: c + 3 * atr,
    rsi, macdH, ema12: e12, ema26: e26, atr
  };
}

export async function runScan(symbols: string[]) {
  const results: Play[] = [];
  for (const sym of symbols) {
    try {
      const candles = await fetchCandles(sym, "1h", 300);
      const r = scoreOne(candles);
      if (r) results.push({ ...r, symbol: sym });
    } catch {}
  }
  results.sort((a,b)=>b.score - a.score);
  return { asOf: new Date().toISOString(), top: results.slice(0,5), all: results };
}
