"use client";

import { useState } from "react";
import { useLocale } from "next-intl";

const LINKS = [
  { label: "🎮 ดีลเกมและอุปกรณ์", href: "https://s.lazada.co.th/s.ZhTKMF?c=b&t=p-i6RvCVf-sRab381" },
  { label: "⚡ แฟลชเซล วันนี้เท่านั้น", href: "https://s.lazada.co.th/s.ZhTKLe?c=a&t=p-iHa6GOt-s2EYQBV0" },
];

export function LazadaBanner() {
  const locale = useLocale();
  const [dismissed, setDismissed] = useState(false);

  if (locale !== "th" || dismissed) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 w-56 rounded-2xl border border-orange-500/30 bg-[#0d0d14] shadow-[0_0_32px_rgba(245,114,36,0.2)] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between bg-[#F57224] px-3 py-2">
        <div className="flex items-center gap-1.5">
          <span className="text-base">🛍️</span>
          <span className="text-xs font-bold text-white">ข้อเสนอ Lazada</span>
        </div>
        <button
          onClick={() => setDismissed(true)}
          aria-label="ปิด"
          className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors text-xs leading-none"
        >
          ✕
        </button>
      </div>

      {/* Links */}
      <div className="flex flex-col gap-1.5 p-2.5">
        {LINKS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="flex items-center gap-2 rounded-lg bg-orange-500/10 px-3 py-2 text-xs font-semibold text-orange-400 ring-1 ring-orange-500/20 hover:bg-orange-500/20 hover:text-orange-300 transition-all"
          >
            {link.label}
            <svg className="ml-auto h-3 w-3 shrink-0 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        ))}
        <p className="mt-0.5 text-center text-[10px] text-gray-700">โฆษณา · Lazada</p>
      </div>
    </div>
  );
}
