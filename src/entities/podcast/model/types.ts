import type { Episode } from '@entities/episode';

export interface Podcast {
  id: string;
  name: string;
  author: string;
  image: string;
  summary?: string;
}

export interface PodcastDetail extends Podcast {
  episodes: Episode[];
  genre?: string;
}

export interface ITunesTopPodcastsResponse {
  feed: {
    entry: Array<{
      id: { attributes: { 'im:id': string } };
      'im:name': { label: string };
      'im:artist': { label: string };
      'im:image': Array<{ label: string; attributes: { height: string } }>;
      summary?: { label: string };
    }>;
  };
}

export interface ITunesPodcastLookupResponse {
  results: Array<{
    collectionId?: number;
    trackId?: number;
    artistName?: string;
    collectionName?: string;
    trackName?: string;
    artworkUrl600?: string;
    artworkUrl100?: string;
    releaseDate?: string;
    trackTimeMillis?: number;
    description?: string;
    episodeUrl?: string;
    kind?: string;
    wrapperType?: string;
    primaryGenreName?: string;
  }>;
}
