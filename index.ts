import cron from "node-cron";
import { fetchCandles } from "./lib/fetchCandles";
import { simulate } from "./lib/simulate";

async function runOnce() {
  try {
    const candles = await fetchCandles("BTCUSDT", "15m", 200);
    simulate(candles);
  } catch (err) {
    console.error("Error in runOnce:", err);
  }
}

// Run immediately on start
runOnce();

// Then every 15 minutes
cron.schedule("*/15 * * * *", runOnce);
