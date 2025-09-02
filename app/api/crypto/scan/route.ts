import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const scansDir = path.join(process.cwd(), "backend/scans");

function ensureDir(d:string){ if(!fs.existsSync(d)) fs.mkdirSync(d, {recursive:true}); }

export async function POST(req: Request) {
  const now = new Date();
  const body = await req.json().catch(()=> ({}));
  const {
    symbols = ["BTCUSD","ETHUSD","SOLUSD"],
    timeframe = "4h",
    lookback_bars = 200,
    model_version = "0.3.0",
    edge_threshold = 0.02
  } = body || {};

  // TODO: replace with real indicator math – placeholder deterministic picks:
  const picks = [
    { symbol:"BTCUSD", name:"Bitcoin", timeframe, side:"LONG",  score:0.68, edge:0.07, confidence:0.82,
      entry:60000, stop:58500, target:61800, horizonHrs:24, expiresAt:new Date(now.getTime()+24*3600e3).toISOString(),
      stakeUnits:0.50, rationale:[{name:"Trend",weight:0.35,contribution:0.24},{name:"Momentum",weight:0.35,contribution:0.18}],
    },
    { symbol:"ETHUSD", name:"Ethereum", timeframe, side:"LONG",  score:0.63, edge:0.04, confidence:0.75,
      entry:2500, stop:2435, target:2575, horizonHrs:24, expiresAt:new Date(now.getTime()+24*3600e3).toISOString(),
      stakeUnits:0.30, rationale:[{name:"Breakout",weight:0.20,contribution:0.10}],
    },
    { symbol:"SOLUSD", name:"Solana", timeframe, side:"SHORT", score:0.38, edge:0.03, confidence:0.70,
      entry:150, stop:156, target:145.5, horizonHrs:24, expiresAt:new Date(now.getTime()+24*3600e3).toISOString(),
      stakeUnits:0.20, rationale:[{name:"Vol Filter",weight:0.10,contribution:0.10}],
    },
  ].filter(p => p.edge >= edge_threshold);

  const snapshot = {
    scan_ts: now.toISOString(),
    params: { symbols, timeframe, lookback_bars, model_version, edge_threshold },
    picks
  };

  ensureDir(scansDir);
  const fname = path.join(scansDir, `scan_${now.toISOString().replace(/[:.]/g,"-")}.json`);
  fs.writeFileSync(fname, JSON.stringify(snapshot, null, 2));
  return NextResponse.json({ ...snapshot, saved: fname.replace(process.cwd()+"/","") });
}

export async function GET() {
  const dir = scansDir;
  if (!fs.existsSync(dir)) return NextResponse.json([]);
  const files = fs.readdirSync(dir).filter(f=>f.endsWith(".json")).sort().slice(-20);
  const out = files.map(f => ({ file:f, path:`backend/scans/${f}` }));
  return NextResponse.json(out.reverse());
}
