import { NextResponse } from "next/server";
import fs from "fs";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const raw = fs.readFileSync("data/plays.json","utf8");
    const json = JSON.parse(raw);
    return NextResponse.json(json);
  } catch {
    return NextResponse.json({ asOf:null, top:[], all:[], error:"No scan yet. Hit /api/scan." }, { status: 200 });
  }
}
