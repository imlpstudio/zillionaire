import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const accFile = path.join(process.cwd(), "backend/ledger/account.json");
const posFile = path.join(process.cwd(), "backend/ledger/positions.csv");
const trdFile = path.join(process.cwd(), "backend/ledger/trades.csv");
const marksFile = path.join(process.cwd(), "backend/marks/last_prices.csv");

function parseCSV(raw:string){
  const [h, ...rows] = raw.trim().split(/\r?\n/);
  const cols = h.split(",");
  const data = rows.filter(Boolean).map(line => {
    const vals = line.split(",");
    const o:any = {}; cols.forEach((c,i)=>o[c]=vals[i]); return o;
  });
  return data;
}

export async function GET() {
  const acc = JSON.parse(fs.readFileSync(accFile,"utf8"));
  const trades = fs.existsSync(trdFile) ? parseCSV(fs.readFileSync(trdFile,"utf8")) : [];
  const positions = fs.existsSync(posFile) ? parseCSV(fs.readFileSync(posFile,"utf8")) : [];
  const marks = fs.existsSync(marksFile) ? parseCSV(fs.readFileSync(marksFile,"utf8")) : [];

  const marksIdx = new Map<string, number>();
  for (const m of marks) marksIdx.set(m.symbol, Number(m.last_price));

  // MTM equity
  let mtm = 0;
  for (const p of positions) {
    const qty = Number(p.qty)||0;
    const last = marksIdx.get(p.symbol) ?? Number(p.avg_cost)||0;
    mtm += qty * last;
  }
  const equity = Number(acc.cash) + mtm;

  // Simple KPIs
  const startEquity = 100000;
  const roi = (equity - startEquity) / startEquity;
  const n = trades.length;
  // naive hit: count positive notional on longs/shorts is not ideal; better once you add exits
  const hit = 0; // placeholder until explicit exits are wired

  return NextResponse.json({
    summary: {
      equity: Number(equity.toFixed(2)),
      roi_pct: Number((roi*100).toFixed(2)),
      trades_logged: n
    }
  });
}
