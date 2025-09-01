export type Candle = { time: number; open: number; high: number; low: number; close: number; volume: number };

export async function fetchCandles(symbol = "BTCUSDT", interval = "15m", limit = 200): Promise<Candle[]> {
  const res = await fetch(`https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`);
  if (!res.ok) throw new Error("Failed to fetch candles");
  const data: unknown = await res.json();
  if (!Array.isArray(data)) throw new Error("Unexpected candles response");
  return (data as any[]).map((d) => ({
    time: d[0] as number,
    open: +d[1],
    high: +d[2],
    low: +d[3],
    close: +d[4],
    volume: +d[5],
  }));
}
