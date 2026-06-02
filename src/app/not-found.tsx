import Link from "next/link";
import { getTranslations } from "next-intl/server";

export default async function NotFound() {
  const t = await getTranslations("notFound");

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4 text-center">
      <div className="text-7xl select-none">🎮</div>
      <h1 className="text-3xl font-extrabold text-white">{t("title")}</h1>
      <p className="text-gray-500">{t("message")}</p>
      <Link
        href="/"
        className="rounded-lg bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-400 transition-colors"
      >
        {t("back")}
      </Link>
    </div>
  );
}
