import { NextRequest, NextResponse } from "next/server";
import { getToken, getGameById, getStreamsByGame, boxArtUrl, streamThumbnailUrl } from "@/lib/twitch";
import { getGameByName, igdbCoverUrl, igdbScreenshotUrl } from "@/lib/igdb";

export const revalidate = 300;

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const token = await getToken();
    const clientId = process.env.TWITCH_CLIENT_ID!;

    const [twitchGame, streams] = await Promise.all([
      getGameById(id, token),
      getStreamsByGame(id, token),
    ]);

    if (!twitchGame) {
      return NextResponse.json({ error: "Game not found" }, { status: 404 });
    }

    const igdbGame = await getGameByName(twitchGame.name, token, clientId).catch(() => null);

    return NextResponse.json({
      twitchId: twitchGame.id,
      name: twitchGame.name,
      boxArtUrl: boxArtUrl(twitchGame.box_art_url, 285, 380),
      coverUrl: igdbGame?.cover ? igdbCoverUrl(igdbGame.cover.image_id) : undefined,
      rating: igdbGame?.rating != null ? Math.round(igdbGame.rating) : undefined,
      summary: igdbGame?.summary,
      genres: igdbGame?.genres?.map((g) => g.name) ?? [],
      screenshots: igdbGame?.screenshots?.slice(0, 8).map((s) => igdbScreenshotUrl(s.image_id)) ?? [],
      streams: streams.map((s) => ({
        login: s.user_login,
        displayName: s.user_name,
        title: s.title,
        viewers: s.viewer_count,
        thumbnailUrl: streamThumbnailUrl(s.thumbnail_url, 440, 248),
      })),
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch game" }, { status: 500 });
  }
}
