import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const accFile = path.join(process.cwd(), "backend/ledger/account.json");
const posFile = path.join(process.cwd(), "backend/ledger/positions.csv");
const marksFile = path.join(process.cwd(), "backend/marks/last_prices.csv");

function readJSON(p:string){ return JSON.parse(fs.readFileSync(p,"utf8")); }
function writeJSON(p:string, v:any){ fs.writeFileSync(p, JSON.stringify(v, null, 2)); }

function parseCSV(raw:string){
  const [h, ...rows] = raw.trim().split(/\r?\n/);
  if(!h) return { header:"", cols:[], data:[] as any[] };
  const cols = h.split(",");
  const data = rows.filter(Boolean).map(line => {
    const vals = line.split(","); const o:any = {};
    cols.forEach((c,i)=>o[c]=vals[i]); return o;
  });
  return { header:h, cols, data };
}

export async function GET() {
  const acc = readJSON(accFile);
  const pos = fs.existsSync(posFile) ? parseCSV(fs.readFileSync(posFile,"utf8")).data : [];
  const marksIdx = new Map<string, number>();
  if (fs.existsSync(marksFile)) {
    const m = parseCSV(fs.readFileSync(marksFile,"utf8")).data;
    for (const r of m) marksIdx.set(r.symbol, Number(r.last_price));
  }

  let mtm = 0;
  const positions = pos.map((p:any)=>{
    const qty = Number(p.qty)||0;
    const last = marksIdx.get(p.symbol) ?? Number(p.avg_cost)||0;
    const mv = qty * last;
    mtm += mv;
    return { ...p, last_price: last, market_value: mv };
  });

  const equity = Number(acc.cash) + mtm;
  return NextResponse.json({ ...acc, equity, positions });
}

export async function POST(req: Request) {
  const body = await req.json().catch(()=> ({}));
  if (body?.action === "reset") {
    const balance = Number(body.balance || 100000);
    const next = { currency:"USD", cash: balance, equity: balance, updated_at: new Date().toISOString() };
    writeJSON(accFile, next);
    fs.writeFileSync(posFile, "symbol,qty,avg_cost,opened_ts,last_update_ts\n");
    return NextResponse.json(next);
  }
  return NextResponse.json({ error: "Unsupported action" }, { status: 400 });
}
