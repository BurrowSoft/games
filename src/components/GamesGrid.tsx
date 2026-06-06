"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { GameCard } from "@/components/GameCard";
import type { EnrichedGame } from "@/lib/types";
import { SpinnerIcon } from "@burrowsoft/shared";

interface ProviderStatus {
  label: string;
  done: boolean;
  error: boolean;
}

function LoadingOverlay({ providers, visible }: { providers: ProviderStatus[]; visible: boolean }) {
  const t = useTranslations("games");
  return (
    <div
      className={`fixed inset-0 z-40 flex items-center justify-center bg-[#0d0d14]/90 backdrop-blur-sm transition-opacity duration-500 ${visible ? "opacity-100" : "pointer-events-none opacity-0"}`}
    >
      <div className="w-80 rounded-2xl border border-white/10 bg-gray-900 p-6 shadow-2xl">
        <div className="mb-4 flex items-center gap-2">
          <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
          <span className="text-sm font-semibold text-white">{t("loadingTitle")}</span>
        </div>
        <ul className="space-y-3">
          {providers.map((p) => (
            <li key={p.label} className="flex items-center gap-3">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center">
                {p.done ? (
                  p.error ? (
                    <svg className="h-4 w-4 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                    </svg>
                  ) : (
                    <svg className="h-4 w-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  )
                ) : (
                  <SpinnerIcon className="h-4 w-4 text-gray-500" />
                )}
              </span>
              <span className={`text-sm ${p.done ? (p.error ? "text-yellow-400" : "text-gray-300") : "text-gray-500"}`}>
                {p.done && p.error
                  ? t("unavailable", { provider: p.label })
                  : t("loading", { provider: p.label })}
                {p.done && !p.error && <span className="ml-1 text-emerald-400">✓</span>}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function GamesGrid() {
  const t = useTranslations("games");
  const [games, setGames] = useState<EnrichedGame[]>([]);
  const [overlayVisible, setOverlayVisible] = useState(true);
  const [providers, setProviders] = useState<ProviderStatus[]>([
    { label: "Twitch", done: false, error: false },
    { label: "IGDB", done: false, error: false },
  ]);

  useEffect(() => {
    async function load() {
      let twitchGames: EnrichedGame[] = [];
      try {
        const res = await fetch("/api/games");
        twitchGames = (await res.json()) as EnrichedGame[];
        setGames(twitchGames);
      } catch {
        // leave games empty
      }
      setProviders((prev) => prev.map((p) => (p.label === "Twitch" ? { ...p, done: true } : p)));

      if (twitchGames.length > 0) {
        try {
          const res = await fetch("/api/igdb", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ igdbIds: twitchGames.map((g) => g.igdbId) }),
          });
          if (!res.ok) throw new Error("IGDB error");

          const igdbData = (await res.json()) as Array<{
            igdbId: string;
            rating?: number;
            coverUrl?: string;
            genres?: string[];
            summary?: string;
          }>;

          const igdbById = new Map(igdbData.map((g) => [g.igdbId, g]));
          setGames((prev) =>
            prev.map((game) => {
              const match = igdbById.get(game.igdbId);
              if (!match) return game;
              return {
                ...game,
                coverUrl: match.coverUrl ?? game.coverUrl,
                rating: match.rating,
                genres: match.genres,
                summary: match.summary,
              };
            })
          );
          setProviders((prev) => prev.map((p) => (p.label === "IGDB" ? { ...p, done: true } : p)));
        } catch {
          setProviders((prev) => prev.map((p) => (p.label === "IGDB" ? { ...p, done: true, error: true } : p)));
        }
      } else {
        setProviders((prev) => prev.map((p) => (p.label === "IGDB" ? { ...p, done: true } : p)));
      }

      setTimeout(() => setOverlayVisible(false), 600);
    }

    void load();
  }, []);

  const allDone = providers.every((p) => p.done);

  return (
    <>
      <LoadingOverlay providers={providers} visible={overlayVisible && !allDone} />

      {games.length === 0 && allDone ? (
        <div className="flex min-h-64 items-center justify-center rounded-xl border border-dashed border-gray-800 text-gray-600">
          {t("noResults")}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {games.map((game) => (
              <GameCard key={game.twitchId} game={game} />
            ))}
          </div>

          {providers.find((p) => p.label === "IGDB")?.error && (
            <p className="mt-4 text-center text-xs text-gray-700">{t("igdbUnavailable")}</p>
          )}

          <p className="mt-6 text-center text-xs text-gray-700">{t("rankingsNote")}</p>
        </>
      )}
    </>
  );
}
