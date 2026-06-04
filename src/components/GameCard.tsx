import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { formatViewers } from "@/lib/twitch";
import type { EnrichedGame } from "@/lib/types";

function RatingStars({ rating }: { rating: number }) {
  const stars = Math.round((rating / 100) * 5);
  return (
    <div className="flex items-center gap-0.5" aria-label={`Rating: ${rating}/100`}>
      {Array.from({ length: 5 }, (_, i) => (
        <svg
          key={i}
          className={`h-3 w-3 ${i < stars ? "text-yellow-400" : "text-gray-700"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export function GameCard({ game }: { game: EnrichedGame }) {
  const t = useTranslations("games");
  const art = game.coverUrl ?? game.boxArtUrl;
  const twitchUrl = `https://www.twitch.tv/directory/game/${encodeURIComponent(game.name)}`;

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl border border-white/5 bg-gray-900/60 transition-all duration-200 hover:border-emerald-500/60 hover:shadow-[0_0_24px_rgba(16,185,129,0.15)]">
      <Link href={`/game/${game.twitchId}`} className="relative aspect-[3/4] w-full overflow-hidden bg-gray-800 block">
        <Image
          src={art}
          alt={game.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

        <div className="absolute top-2 left-2 flex h-7 min-w-7 items-center justify-center rounded-full bg-black/70 px-1.5 text-xs font-bold text-emerald-400 ring-1 ring-emerald-500/30">
          #{game.rank}
        </div>

        {game.liveViewers > 0 && (
          <div className="absolute bottom-2 left-2 flex items-center gap-1.5 rounded-full bg-black/75 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
            <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" />
            {t("viewers", { count: formatViewers(game.liveViewers) })}
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-3">
        <Link href={`/game/${game.twitchId}`} className="group/title">
          <h2 className="truncate text-sm font-semibold text-white group-hover/title:text-emerald-400 transition-colors">
            {game.name}
          </h2>
        </Link>

        {game.rating != null && <RatingStars rating={game.rating} />}

        {game.genres && game.genres.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {game.genres.slice(0, 2).map((g) => (
              <span key={g} className="rounded-full bg-gray-800 px-2 py-0.5 text-[10px] text-gray-400">
                {g}
              </span>
            ))}
          </div>
        )}

        <a
          href={twitchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto flex items-center justify-center gap-1.5 rounded-lg bg-purple-600/80 px-3 py-1.5 text-xs font-semibold text-white hover:bg-purple-500 transition-colors"
        >
          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z" />
          </svg>
          {t("watchOnTwitch")}
        </a>
      </div>
    </div>
  );
}
