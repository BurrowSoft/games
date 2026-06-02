# GamesMole — TODO3: Thai Localisation + Language Selector

## Permissions
Ask the user to enable bypass permissions before starting: `claude --dangerously-skip-permissions`.

## Please fill in Reports3.md when done.

## Overview
When a user visits from Thailand (`x-vercel-ip-country: TH`), the app defaults to Thai. All users get a language selector (EN / TH) in the header.

## Architecture: `next-intl` with cookie-based locale (no URL changes)
- Install `next-intl`
- Messages: `src/messages/en.json` and `src/messages/th.json`
- Locale in `NEXT_LOCALE` cookie
- Locale detection: cookie → `detectCountry()` → TH defaults to `th`, else `en`

## Tasks

### 1. Install and configure next-intl
```bash
npm install next-intl
```
- `src/i18n.ts`, `src/middleware.ts`, wrap layout with `NextIntlClientProvider`

### 2. Translation files

**`src/messages/en.json`**
```json
{
  "nav": { "home": "GamesMole", "search": "Search Games" },
  "hero": { "title": "Top Games Live Right Now", "subtitle": "Ranked by live viewers on Twitch." },
  "games": {
    "viewers": "{count} viewers",
    "watchOnTwitch": "Watch on Twitch",
    "watchStream": "Watch stream",
    "viewOnSteam": "View on Steam",
    "liveNow": "Live now",
    "topGames": "Top Games",
    "loading": "Loading games from {provider}…",
    "unavailable": "{provider} unavailable",
    "rating": "Rating",
    "genres": "Genres",
    "search": "Search games…",
    "noResults": "No games found.",
    "screenshots": "Screenshots"
  },
  "footer": { "tagline": "Digging deep. Building solutions." }
}
```

**`src/messages/th.json`**
```json
{
  "nav": { "home": "GamesMole", "search": "ค้นหาเกม" },
  "hero": { "title": "เกมยอดนิยมตอนนี้", "subtitle": "จัดอันดับตามจำนวนผู้ชมสดบน Twitch" },
  "games": {
    "viewers": "{count} ผู้ชม",
    "watchOnTwitch": "ดูบน Twitch",
    "watchStream": "ดูสตรีม",
    "viewOnSteam": "ดูบน Steam",
    "liveNow": "ถ่ายทอดสดตอนนี้",
    "topGames": "เกมยอดนิยม",
    "loading": "กำลังโหลดเกมจาก {provider}…",
    "unavailable": "{provider} ไม่พร้อมใช้งาน",
    "rating": "คะแนน",
    "genres": "ประเภทเกม",
    "search": "ค้นหาเกม…",
    "noResults": "ไม่พบเกม",
    "screenshots": "ภาพหน้าจอ"
  },
  "footer": { "tagline": "ค้นหาลึก สร้างสรรค์โซลูชัน" }
}
```

### 3. Language selector
`src/components/LanguageSelector.tsx` — 🇬🇧 EN / 🇹🇭 TH, sets cookie + `router.refresh()`.

### 4. Replace hardcoded strings
Priority: `layout.tsx`, `GamesGrid.tsx`, `GameCard.tsx`, `GamesLoadingOverlay.tsx`, and the game detail page.

### 5. Thai font
```tsx
import { Sarabun } from "next/font/google";
const sarabun = Sarabun({ subsets: ["thai", "latin"], weight: ["400", "600", "700"] });
```

### 6. Note on content
Game titles, streamer names, and genre tags come from Twitch/IGDB APIs — these are in English regardless of locale. Only the UI chrome (labels, buttons, navigation) is translated. Do not attempt to translate game/streamer names.
