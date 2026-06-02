const TOKEN_URL = "https://id.twitch.tv/oauth2/token";
const API_BASE = "https://api.twitch.tv/helix";

export interface TwitchGame {
  id: string;
  name: string;
  box_art_url: string;
  igdb_id: string;
}

interface TwitchStream {
  game_id: string;
  viewer_count: number;
}

export interface GameWithViewers extends TwitchGame {
  rank: number;
  liveViewers: number;
}

async function getToken(): Promise<string> {
  const clientId = process.env.TWITCH_CLIENT_ID;
  const clientSecret = process.env.TWITCH_CLIENT_SECRET;
  if (!clientId || !clientSecret) throw new Error("Missing Twitch credentials");

  const res = await fetch(
    `${TOKEN_URL}?client_id=${clientId}&client_secret=${clientSecret}&grant_type=client_credentials`,
    { method: "POST", next: { revalidate: 3600 } }
  );
  if (!res.ok) throw new Error(`Twitch token failed: ${res.status}`);
  const json = (await res.json()) as { access_token: string };
  return json.access_token;
}

async function apiFetch<T>(path: string, token: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Client-Id": process.env.TWITCH_CLIENT_ID!,
    },
    next: { revalidate: 300 },
  });
  if (!res.ok) throw new Error(`Twitch API ${res.status}: ${path}`);
  return res.json() as Promise<T>;
}

export function boxArtUrl(url: string, w = 285, h = 380): string {
  return url.replace("{width}", String(w)).replace("{height}", String(h));
}

export function formatViewers(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

export async function getTopGamesWithViewers(count = 40): Promise<GameWithViewers[]> {
  try {
    const token = await getToken();
    const [gamesData, streamsData] = await Promise.all([
      apiFetch<{ data: TwitchGame[] }>(`/games/top?first=${Math.min(count, 100)}`, token),
      apiFetch<{ data: TwitchStream[] }>("/streams?first=100", token),
    ]);

    const viewersByGame = new Map<string, number>();
    for (const s of streamsData.data) {
      viewersByGame.set(s.game_id, (viewersByGame.get(s.game_id) ?? 0) + s.viewer_count);
    }

    return gamesData.data.map((game, i) => ({
      ...game,
      rank: i + 1,
      liveViewers: viewersByGame.get(game.id) ?? 0,
    }));
  } catch {
    return [];
  }
}
