# GamesMole — API Integration TODO

IMPORTANT: PLEASE KEEP UPDATING YOUR SECTION IN ../Reports.md with
- status
- pending decisions
- pending actions
- concerns
- suggestions

## Permissions
Before starting work, ask the user to enable bypass permissions so you don't get approval prompts on every file operation. They can do this by opening Claude Code settings and setting permission mode to "bypass", or by launching with `claude --dangerously-skip-permissions`.

## Available API Keys (already set on Vercel)
- `TWITCH_CLIENT_ID` + `TWITCH_CLIENT_SECRET` — Twitch Helix API (live streams + top games, already wired)
- `OPENAI_API_KEY` — AI summaries
- These same Twitch credentials also authenticate IGDB (see below)

## Architecture: Client-Driven Fetching
All data fetching must go through Next.js API routes (`/api/games`, `/api/game/[id]`) rather than directly in server components. This enables the client to drive the loading overlay.

Pattern:
1. Page load → client calls `/api/games`
2. API route calls Twitch Helix + IGDB concurrently
3. Client shows the loading overlay per source
4. Results return as JSON; client renders the grid

Wrap Twitch calls with `unstable_cache` (TTL: 5 min / `revalidate: 300`). Wrap IGDB calls with `unstable_cache` (TTL: 60 min / `revalidate: 3600`) — IGDB data changes slowly and has a 4 req/sec rate limit.

## Current State
Twitch Helix is fully wired: fetches top 40 games and aggregates live viewer counts per game. This is working and deployed.

## Tasks

### 1. IGDB — game details, cover art, ratings, screenshots
IGDB (Internet Game Database) is owned by Twitch and uses the same credentials.
Base URL: `https://api.igdb.com/v4`
Auth: POST to `https://id.twitch.tv/oauth2/token` with client_credentials (same flow as Helix, already implemented in `src/lib/twitch.ts`)
Header: `Client-ID: <TWITCH_CLIENT_ID>` + `Authorization: Bearer <token>`

Key endpoints (all POST with a body in IGDB query language):
- `/games` — search by name, get rating, summary, genres, release date
- `/covers` — cover art image_id → `https://images.igdb.com/igdb/image/upload/t_cover_big/<image_id>.jpg`
- `/screenshots` — in-game screenshot image URLs
- `/artworks` — key art images

Tasks:
- **IGDB calls must be batched** — do NOT loop and call IGDB once per game. Collect all 40 game names from Twitch, then make a single IGDB POST to `/games` with a query like `where name = ("Game A","Game B",...); fields ...;`. IGDB supports multi-result queries and has a hard 4 req/sec rate limit — sequential per-game calls will hit it immediately.
- Similarly batch `/covers` and `/screenshots` lookups in single requests
- For each game, map Twitch `game_id` → IGDB result by name match
- Display cover art instead of generic Twitch thumbnails on game cards
- Add rating stars and genre tags to each card
- Add a game detail page `/game/[id]` showing screenshots gallery, summary, genres, top streams

### 2. Live stream thumbnails
Twitch Helix returns `thumbnail_url` for each stream with `{width}` and `{height}` placeholders.
- Replace placeholders with actual dimensions (e.g. 440x248)
- Display stream thumbnails on the game detail page under "Live now"
- Show streamer name, viewer count, stream title

### 3. Game search
- Add a search bar to find games by name
- Search IGDB `/games` endpoint and display results with cover art + rating
- Link to game detail page

### 4. Loading overlay — show while APIs are fetching
The games listing page must show a loading overlay while Twitch and IGDB calls are in flight. Requirements:
- Two concurrent sources; overlay shows: "Loading games from Twitch…" / "Loading details from IGDB…"
- As each resolves, its line gets a checkmark and the grid populates
- If IGDB fails, fall back to Twitch thumbnail — show "IGDB unavailable" in muted text, never a hard error
- Implement as a client component (`<GamesLoadingOverlay providers={string[]} />`)
- Overlay fades out once both sources have settled

### 5. Provider redirect buttons
Every game card and the game detail page must have clear CTA buttons. Requirements:
- "Watch on Twitch" button — links to `https://www.twitch.tv/directory/game/<game_name>` in a new tab
- On the detail page, each live stream listed must have a "Watch stream" button linking to `https://www.twitch.tv/<streamer_login>`
- If IGDB provides a Steam or store URL, add a "View on Steam" / "View on [Store]" button
- All external links: `target="_blank" rel="noopener noreferrer"`

### 6. Themed mascot — GamesMole
Create `public/mascot.svg` — the base BurrowSoft Mole with a game controller held in front, paws gripping both handles (visible above the ledge). Controller should have a D-pad on the left and four face buttons on the right, drawn in the same black line-art stroke style. SVG groups: `<g id="mole-base">` and `<g id="prop">`. ViewBox: `0 0 200 220`.

### 7. App thumbnail / OG image
- `public/og-image.png` — 1200×630px, GamesMole mascot centred on brand background, "GamesMole" wordmark below
- `public/favicon.ico` — mole head only, 32×32 and 16×16
- `public/apple-touch-icon.png` — 180×180px
- Wire all into `src/app/layout.tsx` metadata

### 8. Footer — BurrowSoft branding
Add to the existing footer:
- Small BurrowSoft logo (mole + wordmark) linking to burrowsoft.com
- Links to sibling products: FlyMole, BookingMole, InsightMole, RentACarMole, ShoppingMole
- Copyright: "© 2025 BurrowSoft. All rights reserved."
Logo assets: copy `burrowsoft-logo.svg` from the main-website repo into `public/`.

### 9. GitHub + Vercel setup
Per CLAUDE.md: GamesMole needs a GitHub repo and Vercel project created.
- Create GitHub repo: `burrowsoft/games`
- Create Vercel project linked to that repo
- Set env vars: `TWITCH_CLIENT_ID`, `TWITCH_CLIENT_SECRET`, `NEXT_PUBLIC_ADSENSE_ID`, `OPENAI_API_KEY`
