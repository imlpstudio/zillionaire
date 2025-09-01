export type Trade = { pnl: number; };
export type Metrics = { sharpe: number; profitFactor: number; maxDD: number };

export function computeMetrics(trades: Trade[]): Metrics {
  if (trades.length === 0) return { sharpe: 0, profitFactor: 0, maxDD: 0 };

  // Daily (or per-trade) returns
  const rets = trades.map(t => t.pnl);

  const mean = rets.reduce((a,b) => a+b,0) / rets.length;
  const sd = Math.sqrt(rets.map(r => (r-mean)**2).reduce((a,b)=>a+b,0) / rets.length);
  const sharpe = sd ? (mean/sd)*Math.sqrt(252) : 0;

  const grossProf = rets.filter(r=>r>0).reduce((a,b)=>a+b,0);
  const grossLoss = rets.filter(r=>r<0).reduce((a,b)=>a+b,0);
  const profitFactor = grossLoss === 0 ? Infinity : Math.abs(grossProf/grossLoss);

  let peak = 0, dd = 0, cum=0;
  for (const r of rets) {
    cum += r;
    if (cum > peak) peak = cum;
    dd = Math.min(dd, cum-peak);
  }
  const maxDD = (dd/peak)*100;

  return { sharpe: +sharpe.toFixed(2), profitFactor: +profitFactor.toFixed(2), maxDD: +maxDD.toFixed(2) };
}
