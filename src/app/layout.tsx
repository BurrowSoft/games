import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { Sarabun } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages, getTranslations } from "next-intl/server";
import { Analytics } from "@vercel/analytics/next";
import { SearchBar } from "@/components/SearchBar";
import { LanguageSelector } from "@/components/LanguageSelector";
import { SITE_NAME, SITE_DESCRIPTION, SITE_URL } from "@/lib/seo";
import "./globals.css";

const sarabun = Sarabun({
  subsets: ["thai", "latin"],
  weight: ["400", "600", "700"],
  display: "swap",
});

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
  other: { "google-adsense-account": "ca-pub-1009857008755875" },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} — Top Games Live Right Now`,
    description: SITE_DESCRIPTION,
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — Top Games Live Right Now`,
    description: SITE_DESCRIPTION,
    images: ["/opengraph-image"],
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

const SIBLINGS = [
  { name: "FlyMole", href: "https://flymole.com" },
  { name: "BookingMole", href: "https://bookingmole.com" },
  { name: "InsightMole", href: "https://insightmole.com" },
  { name: "RentACarMole", href: "https://rentacarmole.com" },
  { name: "ShoppingMole", href: "https://shoppingmole.com" },
];

export default async function RootLayout({ children }: { children: ReactNode }) {
  const locale = await getLocale();
  const messages = await getMessages();
  const t = await getTranslations("footer");

  return (
    <html lang={locale} className={sarabun.className}>
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
        <NextIntlClientProvider locale={locale} messages={messages}>
          <header className="sticky top-0 z-50 border-b border-white/5 bg-[#0d0d14]/95 backdrop-blur">
            <nav
              className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3"
              aria-label="Main navigation"
            >
              <Link
                href="/"
                className="flex shrink-0 items-center gap-2 text-xl font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                <span aria-hidden>🎮</span>
                {SITE_NAME}
              </Link>

              <div className="flex-1">
                <SearchBar />
              </div>

              <LanguageSelector />

              <div className="hidden items-center gap-2 text-xs text-gray-600 sm:flex shrink-0">
                <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-red-500" />
                Live
              </div>
            </nav>
          </header>

          <main>{children}</main>

          <footer className="mt-20 border-t border-white/5">
            <div className="mx-auto max-w-7xl px-4 py-10 space-y-8">
              <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
                {SIBLINGS.map((s) => (
                  <a
                    key={s.name}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-gray-600 hover:text-emerald-400 transition-colors"
                  >
                    {s.name}
                  </a>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-600 border-t border-white/5 pt-8">
                <a
                  href="https://burrowsoft.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                >
                  <Image src="/mascot.svg" alt="BurrowSoft" width={28} height={28} className="opacity-60" />
                  <span className="text-xs font-semibold text-gray-500">BurrowSoft</span>
                </a>

                <p className="text-xs">
                  {t("poweredBy")}{" "}
                  <a href="https://www.twitch.tv" target="_blank" rel="noopener noreferrer" className="underline hover:text-emerald-400 transition-colors">Twitch</a>
                  {" "}&amp;{" "}
                  <a href="https://www.igdb.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-emerald-400 transition-colors">IGDB</a>
                </p>

                <div className="flex items-center gap-6 text-xs">
                  <a href="mailto:support@gamesmole.com" className="hover:text-emerald-400 transition-colors">
                    support@gamesmole.com
                  </a>
                  <p>© {new Date().getFullYear()} BurrowSoft. All rights reserved.</p>
                </div>
              </div>
            </div>
          </footer>

          <Analytics />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
