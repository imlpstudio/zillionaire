import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const marksFile = path.join(process.cwd(), "backend/marks/last_prices.csv");

function parseCSV(raw:string){
  const [h, ...rows] = raw.trim().split(/\r?\n/);
  const cols = h.split(",");
  return rows.filter(Boolean).map(line => {
    const vals = line.split(","); const o:any = {};
    cols.forEach((c,i)=>o[c]=vals[i]); return o;
  });
}

export async function POST() {
  if (!fs.existsSync(marksFile)) {
    return NextResponse.json({ ok:false, msg:"marks file missing" }, { status: 404 });
  }
  const data = parseCSV(fs.readFileSync(marksFile,"utf8"));
  return NextResponse.json({ ok:true, updated:data.length, marks:data });
}
