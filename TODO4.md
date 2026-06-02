# GamesMole — TODO4: Complete Thai Localisation

Finish translation coverage and adopt the shared `LanguageSelector` dropdown component.

## Replace LanguageSelector with shared component
Delete `src/components/LanguageSelector.tsx`. In `layout.tsx`:
```tsx
import { LanguageSelector } from "@burrowsoft/shared";
<LanguageSelector locales={["en", "th"]} />
```

The shared version is in `packages/shared/src/components/LanguageSelector.tsx` (already synced).

## Wire SearchBar placeholder
File: `src/components/SearchBar.tsx` (or wherever the search input lives)
- Add `useTranslations("games")` and replace the hardcoded placeholder `"Search games…"` → `t("search")`
- Key already exists in both `messages/en.json` and `messages/th.json`

## Verify all remaining hardcoded strings
Walk through the app and confirm these are all translated (from Reports3 — some may already be done):
- `GamesGrid.tsx` — viewer count, loading states, CTAs
- `GameCard.tsx` — "Watch on Twitch", "View on Steam", "Live now"
- `game/[id]/page.tsx` — game detail labels (Rating, Genres, Screenshots)
- `not-found.tsx` — 404 message
- `page.tsx` hero — title and subtitle

## Test end-to-end
1. Load page in EN
2. Switch locale dropdown to TH — verify Thai render + Sarabun font
3. Switch back to EN
4. Reload — verify cookie persists
5. Confirm game titles/streamer names remain in English (API data, intentionally untranslated)

## Note on API Stories
Games does not have region-specific API work (Twitch/IGDB is global). No API Stories folder needed.
