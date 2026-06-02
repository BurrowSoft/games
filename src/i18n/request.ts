import { getRequestConfig } from "next-intl/server";
import { cookies, headers } from "next/headers";

const LOCALES = ["en", "th"] as const;
type Locale = (typeof LOCALES)[number];

function isLocale(v: string | undefined): v is Locale {
  return LOCALES.includes(v as Locale);
}

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const headersList = await headers();

  const fromCookie = cookieStore.get("NEXT_LOCALE")?.value;
  let locale: Locale = "en";

  if (isLocale(fromCookie)) {
    locale = fromCookie;
  } else {
    const country = headersList.get("x-vercel-ip-country") ?? "";
    locale = country === "TH" ? "th" : "en";
  }

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
