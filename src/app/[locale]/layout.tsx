import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import Image from "next/image";
import {
  Sarabun,
  Noto_Sans_JP,
  Noto_Sans_SC,
  Noto_Sans_TC,
  Noto_Sans_KR,
  Noto_Sans_Arabic,
} from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { Analytics } from "@vercel/analytics/next";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { SearchBar } from "@/components/SearchBar";
import { LocaleSelector } from "@/components/LocaleSelector";
import { RegionalFloatingAd } from "@burrowsoft/shared";
import { SITE_NAME, SITE_DESCRIPTION, SITE_URL } from "@/lib/seo";
import "../globals.css";

const sarabun = Sarabun({ subsets: ["thai", "latin"], weight: ["400", "600", "700"], variable: "--font-sarabun", display: "swap" });
const notoJP   = Noto_Sans_JP({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-noto-jp", display: "swap" });
const notoSC   = Noto_Sans_SC({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-noto-sc", display: "swap" });
const notoTC   = Noto_Sans_TC({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-noto-tc", display: "swap" });
const notoKR   = Noto_Sans_KR({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-noto-kr", display: "swap" });
const notoAR   = Noto_Sans_Arabic({ subsets: ["arabic"], weight: ["400", "700"], variable: "--font-noto-ar", display: "swap" });

const SCRIPT_FONT: Record<string, string> = {
  th: sarabun.variable,
  ja: notoJP.variable,
  zh: notoSC.variable,
  "zh-TW": notoTC.variable,
  ko: notoKR.variable,
  ar: notoAR.variable,
};

const BASE = "https://www.gamesmole.com";

const WEBSITE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "GamesMole",
  "url": BASE,
  "description": "Live gaming rankings, trending games, and top Twitch streams worldwide.",
  "potentialAction": {
    "@type": "SearchAction",
    "target": { "@type": "EntryPoint", "urlTemplate": `${BASE}/?q={game_name}` },
    "query-input": "required name=game_name",
  },
};

const SIBLINGS = [
  { name: "FlyMole", href: "https://flymole.com" },
  { name: "BookingMole", href: "https://bookingmole.com" },
  { name: "InsightMole", href: "https://insightmole.com" },
  { name: "RentACarMole", href: "https://rentacarmole.com" },
  { name: "ShoppingMole", href: "https://shoppingmole.com" },
];

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  const languages = Object.fromEntries(
    routing.locales.map((l) => [
      l,
      l === "en" ? `${BASE}/` : `${BASE}/${l}/`,
    ])
  );
  languages["x-default"] = `${BASE}/`;

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: `${SITE_NAME} — Top Games Live Right Now`,
      template: `%s | ${SITE_NAME}`,
    },
    description: SITE_DESCRIPTION,
    keywords: ["top games", "trending games", "twitch games", "live gaming", "game rankings", "what to play"],
    authors: [{ name: SITE_NAME }],
    creator: SITE_NAME,
    verification: { google: "W09MRBByrmyuX52HfAkr_VzMDeMaOSX8sVJvimAtDqk" },
    other: { "google-adsense-account": "ca-pub-1009857008755875" },
    openGraph: {
      type: "website",
      locale: locale.replace("-", "_"),
      url: locale === "en" ? `${BASE}/` : `${BASE}/${locale}/`,
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
    alternates: {
      canonical: locale === "en" ? `${BASE}/` : `${BASE}/${locale}/`,
      languages,
    },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-video-preview": -1, "max-image-preview": "large", "max-snippet": -1 } },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#10b981",
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages();
  const t = await getTranslations("footer");
  const fontClass = SCRIPT_FONT[locale] ?? sarabun.variable;

  return (
    <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"} className={fontClass}>
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(WEBSITE_SCHEMA) }}
        />
        <NextIntlClientProvider messages={messages}>
          <header className="sticky top-0 z-50 border-b border-white/5 bg-[#0d0d14]/95 backdrop-blur">
            <nav className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3" aria-label="Main navigation">
              <Link
                href="/"
                className="flex shrink-0 items-center gap-2.5"
              >
                <Image
                  src="/logo_no_text_dark.png"
                  alt={SITE_NAME}
                  width={36}
                  height={36}
                  className="shrink-0"
                  priority
                />
                <span className="text-lg font-bold tracking-tight text-emerald-400">{SITE_NAME}</span>
              </Link>
              <div className="flex-1">
                <SearchBar />
              </div>
              <LocaleSelector />
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
                  <a key={s.name} href={s.href} target="_blank" rel="noopener noreferrer"
                    className="text-sm text-gray-600 hover:text-emerald-400 transition-colors">
                    {s.name}
                  </a>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-600 border-t border-white/5 pt-8">
                <a href="https://burrowsoft.com" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                  <Image src="/logo_no_text_dark.png" alt="BurrowSoft" width={28} height={28} className="opacity-60" />
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

          <RegionalFloatingAd />
          <Analytics />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
