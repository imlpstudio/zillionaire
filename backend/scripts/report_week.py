import pandas as pd, numpy as np
from pathlib import Path

DATA_DIR = Path(__file__).resolve().parents[1] / "data"

def settle(bets, results):
    merged = bets.merge(results[["league","game_id","outcome","closing_odds_home","closing_odds_away"]],
                        on=["league","game_id"], how="left")
    merged["won"] = ((merged.selection=="home") & (merged.outcome=="home")) | \
                    ((merged.selection=="away") & (merged.outcome=="away"))
    merged["payout_units"] = np.where(merged.won, merged.stake_units*merged.decimal_odds, 0.0)
    merged["pnl_units"] = merged.payout_units - merged.stake_units
    closing = np.where(merged.selection=="home", merged.closing_odds_home, merged.closing_odds_away)
    merged["clv_pct"] = (merged.decimal_odds - closing)/closing
    return merged

def summarize(trades):
    return {
        "bets": len(trades),
        "staked": trades.stake_units.sum(),
        "pnl": trades.pnl_units.sum(),
        "roi_pct": round(100*trades.pnl_units.sum()/trades.stake_units.sum(),2) if trades.stake_units.sum()>0 else 0,
        "hit_rate": round(100*trades.won.mean(),2) if len(trades)>0 else 0,
        "avg_clv_pct": round(100*trades.clv_pct.mean(),2) if len(trades)>0 else 0
    }

def main():
    bets = pd.read_csv(DATA_DIR/"bets.csv")
    results = pd.read_csv(DATA_DIR/"results.csv")
    trades = settle(bets, results)
    print("=== Weekly Paper Trading Summary ===")
    for k,v in summarize(trades).items():
        print(f"{k:>12}: {v}")

if __name__=="__main__":
    main()
