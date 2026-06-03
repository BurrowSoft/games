# TODO_X: SEO — Google Crawlability & Structured Data

## App: games (https://www.gamesmole.com)

## Permissions
Run with: `claude --dangerously-skip-permissions`

## Do NOT fill a Reports file for this TODO. Just commit and push when done.

## Overview
Three SEO tasks. Do all three. Do NOT change any existing functionality, API routes, or UI.

---

## Task 1 — WebSite JSON-LD in layout.tsx

Add a `<script type="application/ld+json">` tag inside the `<body>` of`src/app/layout.tsx`.

`	sx
const WEBSITE_SCHEMA = { /* see App-specific section below */ };

// Inside the layout return, inside <body>:
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(WEBSITE_SCHEMA) }}
/>
`"

---

## Task 2 — hreflang alternate links

Add to the root `metadata` export in `src/app/layout.tsx`:

`	s
alternates: {
  languages: {
    "en": "https://www.gamesmole.com",
    "th": "https://www.gamesmole.com",
    "es": "https://www.gamesmole.com",
    "ru": "https://www.gamesmole.com",
    "pt-BR": "https://www.gamesmole.com",
    "fr": "https://www.gamesmole.com",
    "ja": "https://www.gamesmole.com",
    "zh": "https://www.gamesmole.com",
    "zh-TW": "https://www.gamesmole.com",
    "ar": "https://www.gamesmole.com",
    "de": "https://www.gamesmole.com",
    "id": "https://www.gamesmole.com",
    "ko": "https://www.gamesmole.com",
    "it": "https://www.gamesmole.com",
    "vi": "https://www.gamesmole.com",
    "x-default": "https://www.gamesmole.com",
  },
},
`"

---

## Task 3 — robots.ts audit

See App-specific section for exact disallow rules.

---

## App-specific: games

### WebSite schema for Task 1

```ts
const WEBSITE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "GamesMole",
  "url": "https://www.gamesmole.com",
  "description": "Live gaming rankings, trending games, and top Twitch streams worldwide.",
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://www.gamesmole.com/?q={game_name}"
    },
    "query-input": "required name=game_name"
  }
};
```

### robots.ts

Disallow: `["/api/", "/_next/"]`

---

## Commit and push

```bash
git add -A
git commit -m "seo: JSON-LD structured data, hreflang, robots.txt"
git push origin master
vercel deploy --prod --yes --scope burrowsoft
```