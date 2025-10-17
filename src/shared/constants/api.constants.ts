export const ITUNES_API = {
  TOP_PODCASTS: 'https://itunes.apple.com/us/rss/toppodcasts/limit=100/genre=1310/json',
  PODCAST_LOOKUP: (id: string) =>
    `https://itunes.apple.com/lookup?id=${id}&media=podcast&entity=podcastEpisode&limit=20`,
} as const;

export const ALL_ORIGINS_PROXY = 'https://api.allorigins.win/get?url=';

export const CACHE_CONFIG = {
  TTL: 24 * 60 * 60 * 1000,
  KEYS: {
    TOP_PODCASTS: 'podcasts:top',
    PODCAST_DETAIL: (id: string) => `podcasts:detail:${id}`,
  },
} as const;
