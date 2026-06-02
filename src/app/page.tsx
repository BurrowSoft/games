import { getTopGamesWithViewers } from "@/lib/twitch";
import { GameCard } from "@/components/GameCard";
import { SITE_DESCRIPTION } from "@/lib/seo";

export const revalidate = 300;

export default async function HomePage() {
  const games = await getTopGamesWithViewers(40);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-10">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-400 ring-1 ring-inset ring-emerald-500/20">
          <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" />
          Live rankings · refreshed every 5 minutes
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
          What&apos;s{" "}
          <span className="bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent">
            Hot
          </span>{" "}
          Right Now
        </h1>
        <p className="mt-3 max-w-2xl text-base text-gray-400">{SITE_DESCRIPTION}</p>
      </div>

      {games.length === 0 ? (
        <div className="flex min-h-64 items-center justify-center rounded-xl border border-dashed border-gray-800 text-gray-600">
          Could not load game rankings right now. Check back in a moment.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {games.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>

          <p className="mt-8 text-center text-xs text-gray-700">
            Rankings based on live viewer data from Twitch. Click any game to watch streams.
          </p>
        </>
      )}
    </div>
  );
}
