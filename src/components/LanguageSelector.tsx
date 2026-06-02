"use client";

import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";

export function LanguageSelector() {
  const locale = useLocale();
  const router = useRouter();

  function switchLocale(next: string) {
    document.cookie = `NEXT_LOCALE=${next}; path=/; max-age=${60 * 60 * 24 * 365}`;
    router.refresh();
  }

  return (
    <div className="flex items-center rounded-lg border border-white/10 bg-gray-900 p-0.5 text-xs font-semibold">
      <button
        onClick={() => switchLocale("en")}
        className={`rounded-md px-2.5 py-1 transition-colors ${
          locale === "en" ? "bg-emerald-600 text-white" : "text-gray-500 hover:text-gray-300"
        }`}
        aria-pressed={locale === "en"}
      >
        🇬🇧 EN
      </button>
      <button
        onClick={() => switchLocale("th")}
        className={`rounded-md px-2.5 py-1 transition-colors ${
          locale === "th" ? "bg-emerald-600 text-white" : "text-gray-500 hover:text-gray-300"
        }`}
        aria-pressed={locale === "th"}
      >
        🇹🇭 TH
      </button>
    </div>
  );
}
