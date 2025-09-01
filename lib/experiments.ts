export type Experiment = {
  id: string;            // e.g., "ema12-26+macd-vwap-2025-09-01"
  name: string;          // short label
  notes?: string;
  createdAt: string;     // ISO
  status: "idea" | "backtest" | "paper" | "pilot" | "done";
  sharpe?: number;
  profitFactor?: number;
  maxDD?: number;        // percent
};

const KEY = "imlp_experiments_v1";

export function loadExperiments(): Experiment[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; }
}

export function saveExperiments(list: Experiment[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(list));
}
