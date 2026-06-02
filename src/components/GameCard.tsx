import Image from "next/image";
import { boxArtUrl, formatViewers } from "@/lib/twitch";
import type { GameWithViewers } from "@/lib/twitch";

export function GameCard({ game }: { game: GameWithViewers }) {
  const twitchUrl = `https://www.twitch.tv/directory/game/${encodeURIComponent(game.name)}`;
  const art = boxArtUrl(game.box_art_url, 285, 380);

  return (
    <a
      href={twitchUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex flex-col overflow-hidden rounded-xl border border-white/5 bg-gray-900/60 transition-all duration-200 hover:border-emerald-500/60 hover:shadow-[0_0_24px_rgba(16,185,129,0.15)]"
    >
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-gray-800">
        <Image
          src={art}
          alt={game.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        <div className="absolute top-2 left-2 flex h-7 min-w-7 items-center justify-center rounded-full bg-black/70 px-1.5 text-xs font-bold text-emerald-400 ring-1 ring-emerald-500/30">
          #{game.rank}
        </div>

        {game.liveViewers > 0 && (
          <div className="absolute bottom-2 left-2 flex items-center gap-1.5 rounded-full bg-black/75 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
            <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" />
            {formatViewers(game.liveViewers)} watching
          </div>
        )}
      </div>

      <div className="p-3">
        <h2 className="truncate text-sm font-semibold text-white group-hover:text-emerald-400 transition-colors">
          {game.name}
        </h2>
        <p className="mt-0.5 text-xs text-gray-600 group-hover:text-gray-500 transition-colors">
          Watch on Twitch →
        </p>
      </div>
    </a>
  );
}
