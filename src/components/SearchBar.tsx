"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import type { SearchResult } from "@/lib/types";

export function SearchBar() {
  const t = useTranslations("games");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const debounce = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleChange(val: string) {
    setQuery(val);
    if (debounce.current) clearTimeout(debounce.current);
    if (val.trim().length < 2) {
      setResults([]);
      setOpen(false);
      return;
    }
    debounce.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(val.trim())}`);
        const data = (await res.json()) as SearchResult[];
        setResults(data);
        setOpen(true);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 350);
  }

  return (
    <div ref={ref} className="relative w-full max-w-xs">
      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        {loading && (
          <svg className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-emerald-500" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
        )}
        <input
          type="search"
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          onFocus={() => results.length > 0 && setOpen(true)}
          placeholder={t("search")}
          className="w-full rounded-lg border border-white/10 bg-gray-900 py-1.5 pl-9 pr-4 text-sm text-white placeholder-gray-600 outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/40"
        />
      </div>

      {open && results.length > 0 && (
        <ul className="absolute left-0 right-0 top-full z-50 mt-1.5 overflow-hidden rounded-xl border border-white/10 bg-gray-900 shadow-2xl">
          {results.map((r) => (
            <li key={r.name}>
              <a
                href={`https://www.twitch.tv/directory/game/${encodeURIComponent(r.name)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-3 py-2.5 hover:bg-gray-800 transition-colors"
                onClick={() => { setOpen(false); setQuery(""); }}
              >
                {r.coverUrl ? (
                  <div className="relative h-10 w-7 shrink-0 overflow-hidden rounded">
                    <Image src={r.coverUrl} alt={r.name} fill className="object-cover" unoptimized />
                  </div>
                ) : (
                  <div className="h-10 w-7 shrink-0 rounded bg-gray-800" />
                )}
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-white">{r.name}</p>
                  {r.genres.length > 0 && (
                    <p className="truncate text-xs text-gray-500">{r.genres.slice(0, 2).join(", ")}</p>
                  )}
                </div>
                {r.rating != null && (
                  <span className="ml-auto shrink-0 text-xs font-semibold text-emerald-400">{r.rating}</span>
                )}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
