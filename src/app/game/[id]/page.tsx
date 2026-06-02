"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { formatViewers } from "@/lib/twitch";
import type { GameDetail } from "@/lib/types";

function RatingBar({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="h-2 w-32 rounded-full bg-gray-800">
        <div
          className="h-2 rounded-full bg-emerald-500 transition-all"
          style={{ width: `${rating}%` }}
        />
      </div>
      <span className="text-sm font-semibold text-emerald-400">{rating}/100</span>
    </div>
  );
}

export default function GameDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [game, setGame] = useState<GameDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeScreenshot, setActiveScreenshot] = useState(0);

  useEffect(() => {
    fetch(`/api/game/${id}`)
      .then((r) => r.json())
      .then((data: GameDetail) => setGame(data))
      .catch(() => setGame(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <svg className="h-8 w-8 animate-spin text-emerald-500" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <p className="text-gray-500">Game not found.</p>
        <Link href="/" className="text-emerald-400 hover:text-emerald-300 text-sm">
          ← Back to rankings
        </Link>
      </div>
    );
  }

  const twitchUrl = `https://www.twitch.tv/directory/game/${encodeURIComponent(game.name)}`;
  const art = game.coverUrl ?? game.boxArtUrl;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <Link href="/" className="mb-8 inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-emerald-400 transition-colors">
        ← Back to rankings
      </Link>

      {/* Hero */}
      <div className="flex flex-col gap-8 md:flex-row">
        <div className="shrink-0">
          <div className="relative h-[380px] w-[285px] overflow-hidden rounded-2xl border border-white/10 shadow-2xl">
            <Image src={art} alt={game.name} fill className="object-cover" unoptimized />
          </div>
        </div>

        <div className="flex flex-col justify-center gap-4">
          <h1 className="text-3xl font-extrabold text-white sm:text-4xl">{game.name}</h1>

          {game.rating != null && <RatingBar rating={game.rating} />}

          {game.genres && game.genres.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {game.genres.map((g) => (
                <span key={g} className="rounded-full bg-gray-800 px-3 py-1 text-xs font-medium text-gray-300">
                  {g}
                </span>
              ))}
            </div>
          )}

          {game.summary && (
            <p className="max-w-xl text-sm leading-relaxed text-gray-400">{game.summary}</p>
          )}

          <div className="flex flex-wrap gap-3 pt-2">
            <a
              href={twitchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-purple-500 transition-colors"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z" />
              </svg>
              Watch on Twitch
            </a>
          </div>
        </div>
      </div>

      {/* Screenshots */}
      {game.screenshots.length > 0 && (
        <section className="mt-14">
          <h2 className="mb-4 text-lg font-bold text-white">Screenshots</h2>
          <div className="relative overflow-hidden rounded-xl border border-white/5">
            <Image
              src={game.screenshots[activeScreenshot]}
              alt={`${game.name} screenshot ${activeScreenshot + 1}`}
              width={880}
              height={495}
              className="w-full object-cover"
              unoptimized
            />
          </div>
          {game.screenshots.length > 1 && (
            <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
              {game.screenshots.map((src, i) => (
                <button
                  key={i}
                  onClick={() => setActiveScreenshot(i)}
                  className={`relative h-16 w-28 shrink-0 overflow-hidden rounded-lg border-2 transition-all ${i === activeScreenshot ? "border-emerald-500" : "border-transparent opacity-50 hover:opacity-75"}`}
                >
                  <Image src={src} alt={`Thumbnail ${i + 1}`} fill className="object-cover" unoptimized />
                </button>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Live streams */}
      {game.streams.length > 0 && (
        <section className="mt-14">
          <h2 className="mb-4 text-lg font-bold text-white">
            Live Now{" "}
            <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-red-500/10 px-2 py-0.5 text-xs font-medium text-red-400 ring-1 ring-red-500/20">
              <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" />
              {game.streams.length} streams
            </span>
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {game.streams.map((stream) => (
              <a
                key={stream.login}
                href={`https://www.twitch.tv/${stream.login}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group overflow-hidden rounded-xl border border-white/5 bg-gray-900/60 transition-all hover:border-purple-500/50 hover:shadow-[0_0_20px_rgba(168,85,247,0.15)]"
              >
                <div className="relative aspect-video overflow-hidden bg-gray-800">
                  <Image
                    src={stream.thumbnailUrl}
                    alt={stream.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    unoptimized
                  />
                  <div className="absolute top-2 left-2 flex items-center gap-1.5 rounded-full bg-black/75 px-2.5 py-1 text-xs font-medium text-white">
                    <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" />
                    {formatViewers(stream.viewers)}
                  </div>
                </div>
                <div className="p-3">
                  <p className="font-semibold text-sm text-white group-hover:text-purple-400 transition-colors">
                    {stream.displayName}
                  </p>
                  <p className="mt-0.5 line-clamp-1 text-xs text-gray-500">{stream.title}</p>
                  <span className="mt-2 inline-flex items-center gap-1 text-xs text-purple-400 font-medium">
                    Watch stream →
                  </span>
                </div>
              </a>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
