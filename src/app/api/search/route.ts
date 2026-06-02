import { NextRequest, NextResponse } from "next/server";
import { getToken } from "@/lib/twitch";
import { searchIGDB, igdbCoverUrl } from "@/lib/igdb";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim();
  if (!q || q.length < 2) return NextResponse.json([]);

  try {
    const token = await getToken();
    const clientId = process.env.TWITCH_CLIENT_ID!;
    const results = await searchIGDB(q, token, clientId);

    const payload = results.map((g) => ({
      name: g.name,
      rating: g.rating != null ? Math.round(g.rating) : undefined,
      coverUrl: g.cover ? igdbCoverUrl(g.cover.image_id) : undefined,
      genres: g.genres?.map((x) => x.name) ?? [],
    }));

    return NextResponse.json(payload);
  } catch {
    return NextResponse.json({ error: "Search unavailable" }, { status: 503 });
  }
}
