# GamesMole — TODO2 (Follow-up improvements)

## Permissions
Ask the user to enable bypass permissions before starting: Claude Code settings → permission mode "bypass", or `claude --dangerously-skip-permissions`.

## Tasks

### 1. Cross-reference IGDB via igdb_id instead of name matching
The current implementation matches Twitch game names to IGDB game names (string comparison). This breaks for games with slight name differences (e.g. "PUBG: BATTLEGROUNDS" vs "PlayerUnknown's Battlegrounds").

The correct approach: Twitch Helix `/games/top` already returns an `igdb_id` field per game. Use that directly.

Changes required:
- In `/api/games` route: include `igdb_id` in the Twitch response data passed to the client / stored in the cache
- In `/api/igdb` route: change the IGDB query from `where name = (...)` to `where id = (...)` using the numeric igdb_ids
  - IGDB query: `where id = (123,456,789,...); fields name,cover.*,rating,genres.name,summary,screenshots.*;`
- Update the mapping logic: match by `igdb_id` instead of normalised name string
- This eliminates all name-mismatch failures and is more accurate for localised game titles

The `igdb_id` field on the Twitch game object is already a numeric IGDB game ID — no conversion needed.
