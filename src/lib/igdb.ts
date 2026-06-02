const API_BASE = "https://api.igdb.com/v4";

export interface IGDBGame {
  id: number;
  name: string;
  rating?: number;
  summary?: string;
  cover?: { image_id: string };
  genres?: Array<{ name: string }>;
  screenshots?: Array<{ image_id: string }>;
}

export function igdbCoverUrl(imageId: string): string {
  return `https://images.igdb.com/igdb/image/upload/t_cover_big/${imageId}.jpg`;
}

export function igdbScreenshotUrl(imageId: string): string {
  return `https://images.igdb.com/igdb/image/upload/t_screenshot_big/${imageId}.jpg`;
}

async function igdbPost<T>(
  endpoint: string,
  body: string,
  token: string,
  clientId: string,
  revalidate = 3600
): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    method: "POST",
    headers: {
      "Client-ID": clientId,
      Authorization: `Bearer ${token}`,
      "Content-Type": "text/plain",
    },
    body,
    next: { revalidate },
  });
  if (!res.ok) throw new Error(`IGDB ${res.status}: ${endpoint}`);
  return res.json() as Promise<T>;
}

export async function getGamesByNames(
  names: string[],
  token: string,
  clientId: string
): Promise<IGDBGame[]> {
  if (names.length === 0) return [];
  const escaped = names.map((n) => `"${n.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`).join(",");
  const body = `fields name,rating,summary,cover.image_id,genres.name,screenshots.image_id; where name = (${escaped}); limit ${Math.min(names.length, 100)};`;
  return igdbPost<IGDBGame[]>("/games", body, token, clientId, 3600);
}

export async function getGameByName(
  name: string,
  token: string,
  clientId: string
): Promise<IGDBGame | null> {
  const escaped = name.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
  const body = `fields name,rating,summary,cover.image_id,genres.name,screenshots.image_id; where name = "${escaped}"; limit 1;`;
  const results = await igdbPost<IGDBGame[]>("/games", body, token, clientId, 3600);
  return results[0] ?? null;
}

export async function searchIGDB(
  query: string,
  token: string,
  clientId: string
): Promise<IGDBGame[]> {
  const body = `search "${query.replace(/"/g, '\\"')}"; fields name,rating,summary,cover.image_id,genres.name; limit 10;`;
  return igdbPost<IGDBGame[]>("/games", body, token, clientId, 300);
}
