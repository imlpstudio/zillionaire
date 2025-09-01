// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  // Only guard /indicators and /algos
  if (!(pathname.startsWith("/indicators") || pathname.startsWith("/algos"))) {
    return NextResponse.next();
  }

  const cookiePin = req.cookies.get("info_pin")?.value;
  const requiredPin = process.env.INFO_PIN;

  if (!requiredPin) {
    // Allow if no PIN is set (dev safety)
    return NextResponse.next();
  }

  if (cookiePin === requiredPin) return NextResponse.next();

  const url = req.nextUrl.clone();
  url.pathname = "/pin";
  url.search = `?next=${encodeURIComponent(pathname + (search || ""))}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/indicators/:path*", "/algos/:path*"],
};
