import "./globals.css";

export const metadata = {
  title: "Shwealthy",
  description: "Autonomous paper trading portal",
};

function IconBtn({
  href,
  title,
  children,
}: {
  href: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      title={title}
      aria-label={title}
      className="rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500/60"
    >
      <span className="inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-white/10 active:bg-white/15 sm:h-8 sm:w-8">
        {children}
      </span>
    </a>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-black text-white">
        {/* Sticky, mobile-friendly header */}
        <header className="sticky top-0 z-40 border-b border-white/10 bg-black/90 backdrop-blur">
          <nav className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-3 py-2 sm:px-6 sm:py-3 text-sm font-medium">
            {/* Brand (slightly smaller on phones) */}
            <a
              href="/"
              className="shrink-0 font-bold tracking-tight text-white hover:text-emerald-400"
            >
              <span className="text-lg sm:text-xl">Shweatlhy</span>
            </a>

            {/* Flat, icon-first nav (wraps on small screens) */}
            <div className="flex flex-wrap items-center gap-1 sm:gap-2">
              {/* Primary flow */}
              <a
                href="/crypto/console"
                className="rounded-md bg-emerald-600/20 px-3 py-1 text-emerald-300 hover:bg-emerald-600/30 active:bg-emerald-600/40 hidden xs:inline-block"
                title="Crypto Console (1-2-3)"
              >
                Console
              </a>
              <a
                href="/paper"
                className="rounded-md px-3 py-1 hover:bg-white/10 active:bg-white/15 hidden xs:inline-block"
                title="Paper"
              >
                Paper
              </a>
              <a
                href="/backtest"
                className="rounded-md px-3 py-1 hover:bg-white/10 active:bg-white/15 hidden xs:inline-block"
                title="Backtests"
              >
                Backtests
              </a>

              {/* Icons (show on all sizes) */}
              <IconBtn href="/portfolio" title="Portfolio ($)">
                <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
                  <path d="M4 7h16v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7Z" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M8 7V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v1" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M12 10c-2 0-3 .8-3 2s1 2 3 2 3 .8 3 2-1 2-3 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M12 9v10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </IconBtn>

              <IconBtn href="/watchlist" title="Watchlist">
                <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
                  <path d="M1.5 12s4.5-7.5 10.5-7.5S22.5 12 22.5 12 18 19.5 12 19.5 1.5 12 1.5 12Z" stroke="currentColor" strokeWidth="1.5"/>
                  <circle cx="12" cy="12" r="3.5" stroke="currentColor" strokeWidth="1.5"/>
                </svg>
              </IconBtn>

              <IconBtn href="/evaluation-flow" title="Information">
                <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
                  <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M12 8.5v.01M12 11v5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </IconBtn>

              <IconBtn
                href="https://github.com/imlpstudio/zillionaire"
                title="GitHub"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                  <path d="M12 .5A11.5 11.5 0 0 0 .5 12c0 5.08 3.29 9.38 7.86 10.9.58.11.79-.26.79-.58v-2.04c-3.2.7-3.87-1.36-3.87-1.36-.53-1.34-1.3-1.7-1.3-1.7-1.06-.73.08-.71.08-.71 1.17.08 1.78 1.2 1.78 1.2 1.04 1.78 2.73 1.27 3.4.97.11-.75.41-1.27.75-1.56-2.55-.29-5.23-1.28-5.23-5.69 0-1.26.45-2.29 1.2-3.1-.12-.29-.52-1.46.11-3.04 0 0 .98-.31 3.2 1.19a11.1 11.1 0 0 1 5.83 0c2.22-1.5 3.2-1.19 3.2-1.19.63 1.58.23 2.75.11 3.04.75.81 1.2 1.84 1.2 3.1 0 4.42-2.69 5.39-5.25 5.67.42.36.8 1.07.8 2.16v3.2c0 .32.21.69.8.58A11.5 11.5 0 0 0 23.5 12 11.5 11.5 0 0 0 12 .5Z"/>
                </svg>
              </IconBtn>

              {/* Temporary admin / Betting */}
              <a
                href="/secret"
                className="rounded-lg bg-white/10 px-2 py-1 text-xs hover:bg-white/15 active:bg-white/20"
                title="Betting (Admin Console)"
              >
                Betting
              </a>
            </div>
          </nav>
        </header>

        <main>{children}</main>
      </body>
    </html>
  );
}
