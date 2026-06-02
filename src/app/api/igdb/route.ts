import { NextRequest, NextResponse } from "next/server";
import { getToken } from "@/lib/twitch";
import { getGamesByNames, igdbCoverUrl, igdbScreenshotUrl } from "@/lib/igdb";

export const revalidate = 3600;

export async function POST(req: NextRequest) {
  try {
    const { names } = (await req.json()) as { names: string[] };
    if (!Array.isArray(names) || names.length === 0) {
      return NextResponse.json([]);
    }

    const token = await getToken();
    const clientId = process.env.TWITCH_CLIENT_ID!;
    const igdbGames = await getGamesByNames(names, token, clientId);

    const payload = igdbGames.map((g) => ({
      name: g.name,
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
