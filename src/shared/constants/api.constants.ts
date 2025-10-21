export const API_LIMITS = {
  TOP_PODCASTS_LIMIT: 100,
  EPISODES_PER_PODCAST: 20,
  GENRE_PODCASTS: 1310,
} as const;

export const CACHE_DURATION = {
  ONE_DAY_MS: 24 * 60 * 60 * 1000,
  ONE_HOUR_MS: 60 * 60 * 1000,
} as const;

export const ITUNES_API = {
  TOP_PODCASTS: `https://itunes.apple.com/us/rss/toppodcasts/limit=${API_LIMITS.TOP_PODCASTS_LIMIT}/genre=${API_LIMITS.GENRE_PODCASTS}/json`,
  PODCAST_LOOKUP: (id: string) =>
    `https://itunes.apple.com/lookup?id=${id}&media=podcast&entity=podcastEpisode&limit=${API_LIMITS.EPISODES_PER_PODCAST}`,
} as const;

export const ALL_ORIGINS_PROXY = 'https://api.allorigins.win/get?url=';

export const CACHE_CONFIG = {
  TTL: CACHE_DURATION.ONE_DAY_MS,
  KEYS: {
    TOP_PODCASTS: 'podcasts:top',
    PODCAST_DETAIL: (id: string) => `podcasts:detail:${id}`,
  },
} as const;
