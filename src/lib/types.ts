export interface EnrichedGame {
  twitchId: string;
  igdbId: string;
  name: string;
  rank: number;
  liveViewers: number;
  boxArtUrl: string;
  coverUrl?: string;
  rating?: number;
  genres?: string[];
  summary?: string;
}

export interface StreamInfo {
  login: string;
  displayName: string;
  title: string;
  viewers: number;
  thumbnailUrl: string;
}

export interface GameDetail extends EnrichedGame {
  screenshots: string[];
  streams: StreamInfo[];
}

export interface SearchResult {
  name: string;
  rating?: number;
  coverUrl?: string;
  genres: string[];
}
