"use client";

import { useMemo, useState } from "react";
import type { Experiment } from "@/lib/experiments";
import { loadExperiments, saveExperiments } from "@/lib/experiments";
import { Card } from "@/components/card";

export function ExperimentTable() {
  const [items, setItems] = useState<Experiment[]>(() => loadExperiments());
  const [q, setQ] = useState("");

  function add(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get("name") || "").trim();
    const notes = String(fd.get("notes") || "").trim();
    if (!name) return;
    const id = name.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + Date.now();
    const next = [{ id, name, notes, createdAt: new Date().toISOString(), status: "idea" as const }, ...items];
    setItems(next); saveExperiments(next);
    e.currentTarget.reset();
  }

  function update(id: string, patch: Partial<Experiment>) {
    const next = items.map(it => it.id === id ? { ...it, ...patch } : it);
    setItems(next); saveExperiments(next);
  }

  function remove(id: string) {
    const next = items.filter(it => it.id !== id);
    setItems(next); saveExperiments(next);
  }

  const filtered = useMemo(() => {
    const s = q.toLowerCase();
    return items.filter(it =>
      it.name.toLowerCase().includes(s) ||
      (it.notes || "").toLowerCase().includes(s) ||
      it.status.toLowerCase().includes(s)
    );
  }, [items, q]);

  return (
    <div className="space-y-4">
      <Card title="New Experiment" subtitle="Draft, test, and promote candidates through stages" >
        <form onSubmit={add} className="grid gap-3 sm:grid-cols-2">
          <input className="input" name="name" placeholder="e.g., EMA12/26 + MACD + VWAP" />
          <input className="input sm:col-span-2" name="notes" placeholder="Short plan: data window, fees model, stop rules..." />
          <button className="btn btn-primary sm:col-span-2">Add</button>
        </form>
      </Card>

      <div className="flex items-center gap-3">
        <input className="input" placeholder="Search experiments…" value={q} onChange={e=>setQ(e.target.value)} />
        <button className="btn" onClick={() => { setQ(""); }}>Clear</button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-white/10">
        <table className="w-full text-sm">
          <thead className="bg-white/5 text-neutral-300">
            <tr>
              <th className="px-3 py-2 text-left">Name</th>
              <th className="px-3 py-2 text-left">Status</th>
              <th className="px-3 py-2 text-right">Sharpe</th>
              <th className="px-3 py-2 text-right">PF</th>
              <th className="px-3 py-2 text-right">MaxDD%</th>
              <th className="px-3 py-2 text-left">Notes</th>
              <th className="px-3 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(it => (
              <tr key={it.id} className="border-t border-white/10 hover:bg-white/5">
                <td className="px-3 py-2">{it.name}</td>
                <td className="px-3 py-2">
                  <select className="input"
                          value={it.status}
                          onChange={e=>update(it.id, { status: e.target.value as any })}>
                    <option value="idea">idea</option>
                    <option value="backtest">backtest</option>
                    <option value="paper">paper</option>
                    <option value="pilot">pilot</option>
                    <option value="done">done</option>
                  </select>
                </td>
                <td className="px-3 py-2 text-right">
                  <input className="input text-right" type="number" step="0.01"
                         value={it.sharpe ?? ""} onChange={e=>update(it.id, { sharpe: e.target.value === "" ? undefined : +e.target.value })} />
                </td>
                <td className="px-3 py-2 text-right">
                  <input className="input text-right" type="number" step="0.01"
                         value={it.profitFactor ?? ""} onChange={e=>update(it.id, { profitFactor: e.target.value === "" ? undefined : +e.target.value })} />
                </td>
                <td className="px-3 py-2 text-right">
                  <input className="input text-right" type="number" step="0.1"
                         value={it.maxDD ?? ""} onChange={e=>update(it.id, { maxDD: e.target.value === "" ? undefined : +e.target.value })} />
                </td>
                <td className="px-3 py-2">
                  <input className="input" value={it.notes ?? ""} onChange={e=>update(it.id, { notes: e.target.value })} />
                </td>
                <td className="px-3 py-2 text-right">
                  <button className="btn btn-danger" onClick={()=>remove(it.id)}>Delete</button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td className="px-3 py-6 text-neutral-400" colSpan={7}>No experiments yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
