import { NextResponse } from "next/server";
import { getTopGamesWithViewers, boxArtUrl } from "@/lib/twitch";

export const revalidate = 300;

export async function GET() {
  try {
    const games = await getTopGamesWithViewers(40);
    const payload = games.map((g) => ({
      twitchId: g.id,
      name: g.name,
      rank: g.rank,
      liveViewers: g.liveViewers,
      boxArtUrl: boxArtUrl(g.box_art_url, 285, 380),
    }));
    return NextResponse.json(payload);
  } catch {
    return NextResponse.json({ error: "Failed to fetch games" }, { status: 500 });
  }
}
