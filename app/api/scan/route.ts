import { NextResponse } from "next/server";
import { runScan } from "@/lib/scan";
import { UNIVERSE } from "@/lib/universe";
import fs from "fs";

export const dynamic = "force-dynamic";

export async function POST() {
  const data = await runScan(UNIVERSE);
  // NOTE: on Vercel this won't persist; use a DB there.
  fs.writeFileSync("data/plays.json", JSON.stringify(data, null, 2));
  return NextResponse.json({ ok:true, count:data.top.length, asOf:data.asOf });
}
