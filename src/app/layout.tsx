import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { Analytics } from "@vercel/analytics/next";
import { SITE_NAME, SITE_DESCRIPTION, SITE_URL } from "@/lib/seo";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Top Games Live Right Now`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: ["top games", "trending games", "twitch games", "live gaming", "game rankings", "what to play"],
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} — Top Games Live Right Now`,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — Top Games Live Right Now`,
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#10b981",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        {process.env.NEXT_PUBLIC_ADSENSE_ID && (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_ID}`}
            crossOrigin="anonymous"
          />
        )}
      </head>
      <body className="min-h-screen bg-[#0d0d14] text-white antialiased">
        <header className="sticky top-0 z-50 border-b border-white/5 bg-[#0d0d14]/95 backdrop-blur">
          <nav
            className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3"
            aria-label="Main navigation"
          >
            <Link href="/" className="flex items-center gap-2 text-xl font-bold text-emerald-400 hover:text-emerald-300 transition-colors">
              <span aria-hidden>🎮</span>
              {SITE_NAME}
            </Link>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-red-500" />
              Live data · updated every 5 min
            </div>
          </nav>
        </header>

        <main>{children}</main>

        <footer className="mt-20 border-t border-white/5">
          <div className="mx-auto max-w-7xl px-4 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-600">
            <p className="font-semibold text-emerald-500">{SITE_NAME}</p>
            <p className="text-xs">
              Game data powered by{" "}
              <a
                href="https://www.twitch.tv"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-emerald-400 transition-colors"
              >
                Twitch
              </a>
            </p>
            <div className="flex items-center gap-6">
              <a
                href="mailto:support@gamesmole.com"
                className="hover:text-emerald-400 transition-colors"
              >
                support@gamesmole.com
              </a>
              <p>© {new Date().getFullYear()} GamesMole</p>
            </div>
          </div>
        </footer>
        <Analytics />
      </body>
    </html>
  );
}
