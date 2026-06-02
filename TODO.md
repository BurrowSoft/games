# GamesMole — API Integration TODO

## Permissions
Before starting work, ask the user to enable bypass permissions so you don't get approval prompts on every file operation. They can do this by opening Claude Code settings and setting permission mode to "bypass", or by launching with `claude --dangerously-skip-permissions`.

## Available API Keys (already set on Vercel)
- `TWITCH_CLIENT_ID` + `TWITCH_CLIENT_SECRET` — Twitch Helix API (live streams + top games, already wired)
- `OPENAI_API_KEY` — AI summaries
- These same Twitch credentials also authenticate IGDB (see below)

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
- For each game returned by Twitch top games, look up IGDB by name to get: cover art, rating, genres, summary, screenshots
- Cache IGDB results in memory or use Next.js ISR (revalidate: 3600) — IGDB has rate limits
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

### 4. GitHub + Vercel setup
Per CLAUDE.md: GamesMole needs a GitHub repo and Vercel project created.
- Create GitHub repo: `burrowsoft/games`
- Create Vercel project linked to that repo
- Set env vars: `TWITCH_CLIENT_ID`, `TWITCH_CLIENT_SECRET`, `NEXT_PUBLIC_ADSENSE_ID`, `OPENAI_API_KEY`
