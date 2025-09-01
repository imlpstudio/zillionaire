"use client";


import { useState } from "react";


export function OrderTicket() {
const [side, setSide] = useState<"BUY" | "SELL">("BUY");


return (
<form className="grid gap-3 text-sm">
<div className="grid grid-cols-2 gap-2">
<button type="button" onClick={() => setSide("BUY")} className={"btn w-full " + (side === "BUY" ? "btn-primary" : "btn-ghost")}>Buy</button>
<button type="button" onClick={() => setSide("SELL")} className={"btn w-full " + (side === "SELL" ? "btn-danger" : "btn-ghost")}>Sell</button>
</div>


<label className="grid gap-1">
<span>Symbol</span>
<input className="input" placeholder="AAPL" defaultValue="AAPL" />
</label>
<label className="grid gap-1">
<span>Quantity</span>
<input className="input" type="number" placeholder="100" defaultValue={100} />
</label>
<label className="grid gap-1">
<span>Order Type</span>
<select className="input">
<option>Market</option>
<option>Limit</option>
<option>Stop</option>
</select>
</label>
<label className="grid gap-1">
<span>Limit/Stop Price</span>
<input className="input" type="number" placeholder="—" />
</label>


<button className="btn btn-primary mt-2">{side} — Preview</button>
<p className="text-xs text-neutral-400">This is a UI-only ticket for now. Wire to a paper broker later.</p>
</form>
);
}