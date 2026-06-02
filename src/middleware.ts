import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const res = NextResponse.next();

  if (!req.cookies.get("NEXT_LOCALE")) {
    const country = req.headers.get("x-vercel-ip-country") ?? "";
    const locale = country === "TH" ? "th" : "en";
    res.cookies.set("NEXT_LOCALE", locale, { path: "/", maxAge: 60 * 60 * 24 * 365 });
  }

  return res;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|icon.svg).*)"],
};
