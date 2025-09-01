import { NextResponse } from "next/server";
import fs from "fs";

export async function GET() {
  try {
    const text = fs.readFileSync("trades.csv", "utf8");
    const [header, ...lines] = text.trim().split("\n");
    const cols = header.split(",");
    const trades = lines.map(line => {
      const parts = line.split(",");
      const obj: any = {};
      cols.forEach((c,i)=>obj[c]=parts[i]);
      obj.price = +obj.price;
      obj.pnl = obj.pnl ? +obj.pnl : null;
      return obj;
    });

    // Compute equity curve
    let equity = 10000; // start with $10k
    const equityCurve = trades.map(t=>{
      if (t.pnl !== null) equity += t.pnl;
      return { time: t.timestamp, equity };
    });

    return NextResponse.json({ trades, equityCurve });
  } catch (e:any) {
    return NextResponse.json({ error: "No trades yet" }, { status: 404 });
  }
}
