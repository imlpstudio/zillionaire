// =============================
// File: app/layout.tsx
// =============================
import "/Users/irvinglamadrid/ridiculous_trader/paper-trader/app/styles/globals.css";
import type { Metadata } from "next";
import Link from "next/link";


export const metadata: Metadata = {
title: "IMLP Paper Trader",
description: "Dark tech-styled paper trading UI starter",
icons: [{ rel: "icon", url: "/favicon.ico" }],
};


export default function RootLayout({ children }: { children: React.ReactNode }) {
return (
<html lang="en" className="dark">
<body className="bg-grid">
<div className="min-h-svh relative antialiased text-neutral-100">
{/* background accents */}
<div className="pointer-events-none fixed inset-0 -z-10">
<div className="absolute -top-32 left-1/2 h-[480px] w-[480px] -translate-x-1/2 rounded-full bg-emerald-500/20 blur-[110px]" />
<div className="absolute bottom-0 right-0 h-[360px] w-[360px] rounded-full bg-cyan-500/10 blur-[100px]" />
</div>


<header className="sticky top-0 z-20 border-b border-white/10 backdrop-blur supports-[backdrop-filter]:bg-black/40">
<nav className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3">
<Link href="/" className="group inline-flex items-center gap-2">
<div className="size-6 rounded-md bg-gradient-to-br from-emerald-400 to-cyan-400" />
<span className="font-semibold tracking-wide text-neutral-100 group-hover:text-white">IMLP Paper Trader</span>
</Link>
<div className="ml-auto flex items-center gap-2 text-sm">
<NavLink href="/paper">Paper</NavLink>
<NavLink href="/watchlist">Watchlist</NavLink>
<NavLink href="/backtest">Backtest</NavLink>
<NavLink href="/portfolio">Portfolio</NavLink>
<a href="https://github.com" target="_blank" className="rounded-md border border-white/10 bg-white/5 px-3 py-1.5 hover:bg-white/10">GitHub</a>
</div>
</nav>
</header>


{children}


<footer className="border-t border-white/10">
<div className="mx-auto max-w-7xl px-4 py-6 text-sm text-neutral-400">© {new Date().getFullYear()} IMLP Studio — Paper trading UI. All placeholder data.</div>
</footer>
</div>
</body>
</html>
);
}


function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
return (
<Link
href={href}
className="rounded-md px-3 py-1.5 text-neutral-300 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10"
>
{children}
</Link>
);
}