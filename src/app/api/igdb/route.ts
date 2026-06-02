import { NextRequest, NextResponse } from "next/server";
import { getToken } from "@/lib/twitch";
import { getGamesByIds, igdbCoverUrl, igdbScreenshotUrl } from "@/lib/igdb";

export const revalidate = 3600;

export async function POST(req: NextRequest) {
  try {
    const { igdbIds } = (await req.json()) as { igdbIds: string[] };
    if (!Array.isArray(igdbIds) || igdbIds.length === 0) {
      return NextResponse.json([]);
    }

    // Filter out empty strings (games with no IGDB entry) and parse to numbers
    const numericIds = igdbIds
      .filter((id) => id && id !== "")
      .map((id) => parseInt(id, 10))
      .filter((id) => !isNaN(id));

    if (numericIds.length === 0) return NextResponse.json([]);

    const token = await getToken();
    const clientId = process.env.TWITCH_CLIENT_ID!;
    const igdbGames = await getGamesByIds(numericIds, token, clientId);

    const payload = igdbGames.map((g) => ({
      igdbId: String(g.id),
      rating: g.rating != null ? Math.round(g.rating) : undefined,
      summary: g.summary,
      coverUrl: g.cover ? igdbCoverUrl(g.cover.image_id) : undefined,
      genres: g.genres?.map((x) => x.name) ?? [],
      screenshots: g.screenshots?.slice(0, 6).map((s) => igdbScreenshotUrl(s.image_id)) ?? [],
    }));

    return NextResponse.json(payload);
  } catch {
    return NextResponse.json({ error: "IGDB unavailable" }, { status: 503 });
  }
}
