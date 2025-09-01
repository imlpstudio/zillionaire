import { cn } from "/Users/irvinglamadrid/ridiculous_trader/paper-trader/app/lib/utils.ts";


export function Card({ title, subtitle, className, tight, children }: {
title?: string;
subtitle?: string;
className?: string;
tight?: boolean;
children?: React.ReactNode;
}) {
return (
<section className={cn("rounded-xl border border-white/10 bg-white/5 p-4 shadow-[0_0_0_1px_rgba(255,255,255,0.04)_inset]", className)}>
{(title || subtitle) && (
<header className={cn("mb-3", tight && "mb-2") }>
{title && <h2 className="text-sm font-semibold tracking-wide text-neutral-200">{title}</h2>}
{subtitle && <p className="mt-0.5 text-xs text-neutral-400">{subtitle}</p>}
</header>
)}
<div className={cn(tight ? "pt-0" : "pt-1")}>{children}</div>
</section>
);
}