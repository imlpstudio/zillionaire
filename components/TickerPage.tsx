"use client";


import { useEffect, useMemo, useRef, useState } from "react";
import { Card } from "@/components/ui/card";


export function TickerTape({ symbols }: { symbols: string[] }) {
// Placeholder randomizer — swap with real quotes later
const [ticks, setTicks] = useState(() => symbols.map(s => ({ s, p: 100 + Math.random() * 100, d: (Math.random() - 0.5) * 2 })));
const anim = useRef<number | null>(null);


useEffect(() => {
anim.current = window.setInterval(() => {
setTicks(t => t.map(x => ({ ...x, p: +(x.p + (Math.random() - 0.5) * 0.4).toFixed(2), d: +((Math.random() - 0.5) * 0.1).toFixed(3) })));
}, 1500);
return () => { if (anim.current) clearInterval(anim.current); };
}, []);


const items = useMemo(() => {
return [...ticks, ...ticks]; // loop twice for seamless marquee
}, [ticks]);


return (
<Card tight className="overflow-hidden p-0">
<div className="relative">
<div className="marquee">
{items.map((t, i) => (
<div key={i} className="marquee-item">
<span className="font-mono text-sm text-neutral-300">{t.s}</span>
<span className="mx-2 h-4 w-px bg-white/10" />
<span className="font-mono text-sm">{t.p.toFixed(2)}</span>
<span className={"ml-2 text-xs font-semibold " + (t.d >= 0 ? "text-emerald-400" : "text-rose-400")}>{t.d >= 0 ? "+" : ""}{t.d.toFixed(3)}%</span>
</div>
))}
</div>
<div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-black/80 to-transparent" />
<div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-black/80 to-transparent" />
</div>
</Card>
);
}