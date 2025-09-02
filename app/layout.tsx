import "./globals.css";

export const metadata = {
  title: "Shwealthy",
  description: "Autonomous paper trading portal",
};

export default function RootLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-black text-white">
        <header className="border-b border-white/10 bg-black text-white">
          <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 text-sm font-medium text-white">
            {/* Brand */}
            <a href="/" className="font-bold text-white hover:text-emerald-400">
              Shweatlhy
            </a>

            {/* Grouped Nav */}
            <div className="flex items-center gap-4">
              {/* Trading */}
              <details className="group relative">
                <summary className="cursor-pointer rounded-md px-3 py-1 hover:bg-white/5">
                  Trading
                </summary>
                <div className="absolute right-0 z-50 mt-2 min-w-[220px] rounded-lg border border-white/10 bg-black/95 p-2 shadow-xl backdrop-blur">
                  <a href="/plays" className="block rounded px-3 py-2 hover:bg-white/10">Top Plays</a>
                  <a href="/paper" className="block rounded px-3 py-2 hover:bg-white/10">Paper</a>
                  <a href="/algos" className="block rounded px-3 py-2 hover:bg-white/10">Algos</a>
                  <a href="/backtest" className="block rounded px-3 py-2 hover:bg-white/10">Backtests</a>
                  <a href="/crypto/console" className="block rounded px-3 py-2 hover:bg-emerald-600/20 text-emerald-300">
                    Crypto Console (1-2-3)
                  </a>
                </div>
              </details>

              {/* Information */}
              <details className="group relative">
                <summary className="cursor-pointer rounded-md px-3 py-1 hover:bg-white/5">
                  Information
                </summary>
                <div className="absolute right-0 z-50 mt-2 min-w-[260px] rounded-lg border border-white/10 bg-black/95 p-2 shadow-xl backdrop-blur">
                  <a href="/evaluation-flow" className="block rounded px-3 py-2 hover:bg-white/10">Evaluation Flow</a>
                  <a href="/validation-plan" className="block rounded px-3 py-2 hover:bg-white/10">Validation Plan</a>
                </div>
              </details>

              {/* Portfolio */}
              <details className="group relative">
                <summary className="cursor-pointer rounded-md px-3 py-1 hover:bg-white/5">
                  Portfolio
                </summary>
                <div className="absolute right-0 z-50 mt-2 min-w-[200px] rounded-lg border border-white/10 bg-black/95 p-2 shadow-xl backdrop-blur">
                  <a href="/portfolio" className="block rounded px-3 py-2 hover:bg-white/10">Positions</a>
                  <a href="/watchlist" className="block rounded px-3 py-2 hover:bg-white/10">Watchlist</a>
                </div>
              </details>

              {/* Tracking */}
              <details className="group relative">
                <summary className="cursor-pointer rounded-md px-3 py-1 hover:bg-white/5">
                  Tracking
                </summary>
                <div className="absolute right-0 z-50 mt-2 min-w-[220px] rounded-lg border border-white/10 bg-black/95 p-2 shadow-xl backdrop-blur">
                  <a href="/metrics" className="block rounded px-3 py-2 hover:bg-white/10">Metrics</a>
                  <a href="/trades" className="block rounded px-3 py-2 hover:bg-white/10">Trade Log</a>
                </div>
              </details>

              {/* External */}
              <a
                href="https://github.com/imlpstudio/zillionaire"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-md px-3 py-1 hover:bg-white/5"
              >
                GitHub
              </a>

              {/* Temporary admin */}
              <a
                href="/secret"
                className="rounded-lg bg-white/5 px-2 py-1 hover:bg-white/10"
                title="Admin Console (temporary)"
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
