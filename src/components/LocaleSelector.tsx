"use client";

import { useTransition } from "react";
import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { LOCALE_NAMES } from "@burrowsoft/shared";

export function LocaleSelector() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    startTransition(() => {
      router.replace(pathname, { locale: e.target.value });
    });
  }

  return (
    <select
      value={locale}
      onChange={handleChange}
      disabled={isPending}
      aria-label="Select language"
      className="rounded-md border border-white/10 bg-gray-900 px-2.5 py-1.5 text-sm text-gray-300 cursor-pointer transition-opacity disabled:opacity-50 focus:outline-none focus:ring-1 focus:ring-emerald-500/40"
    >
      {routing.locales.map((l) => (
        <option key={l} value={l}>
          {LOCALE_NAMES[l] ?? l}
        </option>
      ))}
    </select>
  );
}
