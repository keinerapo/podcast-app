import { CACHE_CONFIG, ITUNES_API } from '@shared/constants/api.constants';
import { cacheService } from '@shared/services/cache';
import { fetchThroughProxy } from '@shared/services/api/allOrigins.proxy';
import type {
  Episode,
  ITunesPodcastLookupResponse,
  ITunesTopPodcastsResponse,
  Podcast,
  PodcastDetail,
} from '@shared/types/podcast.types';

/**
 * Generic function to fetch data with Cache-Aside pattern
 * @template TResponse - The raw API response type
 * @template TResult - The transformed result type
 * @param cacheKey - The key to use for caching
 * @param url - The API URL to fetch from
 * @param transformer - Function to transform raw response to desired format
 * @returns Cached or freshly fetched data
 */
async function fetchWithCache<TResponse, TResult>(
  cacheKey: string,
  url: string,
  // eslint-disable-next-line no-unused-vars
  transformer: (data: TResponse) => TResult,
): Promise<TResult> {
  const cached = cacheService.get<TResult>(cacheKey);
  if (cached) {
    return cached;
  }
  const response = await fetchThroughProxy<TResponse>(url);
  const result = transformer(response);
  cacheService.set(cacheKey, result);
  
  return result;
}

/**
 * Transform iTunes API top podcasts response to our Podcast interface
 * @param {ITunesTopPodcastsResponse} response - The raw API response object containing the feed data.
 * @returns {Podcast[]} An array of simplified Podcast objects.
 */
function transformTopPodcasts(response: ITunesTopPodcastsResponse): Podcast[] {
  return response.feed.entry.map((entry) => {
    const images = entry['im:image'];
    const highQualityImage = images[images.length - 1]?.label || images[0]?.label || '';

    return {
      id: entry.id.attributes['im:id'],
      name: entry['im:name'].label,
      author: entry['im:artist'].label,
      image: highQualityImage,
      summary: entry.summary?.label,
    };
  });
}

/**
 * Transform iTunes lookup response to our Episode and PodcastDetail interfaces
 * @param {ITunesPodcastLookupResponse} response - The raw API response object containing the podcast and episode data.
 * @param {string} podcastId - The ID of the podcast being looked up, used for error reporting/fallback.
 * @returns {PodcastDetail} A detailed object containing the podcast information and a list of its episodes.
 * @throws {Error} If no podcast information is found in the response results.
 */
function transformPodcastDetail(
  response: ITunesPodcastLookupResponse,
  podcastId: string,
): PodcastDetail {
  const results = response.results;
  const podcastInfo = results[0];
  if (!podcastInfo) {
    throw new Error(`No podcast found with ID: ${podcastId}`);
  }
  const episodesData = results.slice(1);
  const episodes: Episode[] = episodesData
    .filter((item) => item.kind === 'podcast-episode')
    .map((episode) => ({
      id: String(episode.trackId || episode.collectionId || Date.now()),
      title: episode.trackName || 'Untitled Episode',
      description: episode.description || '',
      publishedDate: episode.releaseDate || '',
      duration: episode.trackTimeMillis || 0,
      audioUrl: episode.episodeUrl || '',
      episodeUrl: episode.episodeUrl,
    }));

  const podcast: PodcastDetail = {
    id: String(podcastInfo.collectionId || podcastInfo.trackId || podcastId),
    name: podcastInfo.collectionName || podcastInfo.trackName || 'Unknown Podcast',
    author: podcastInfo.artistName || 'Unknown Author',
    image: podcastInfo.artworkUrl600 || podcastInfo.artworkUrl100 || '',
    summary: podcastInfo.description,
    genre: podcastInfo.primaryGenreName,
    episodes,
  };

  return podcast;
}

/**
 * Fetch top 100 podcasts from iTunes
 * Implements Cache-Aside pattern with 24h TTL
 * @returns Array of top podcasts
 * @throws {ProxyError} When the API request fails
 */
export async function getTopPodcasts(): Promise<Podcast[]> {
  return fetchWithCache<ITunesTopPodcastsResponse, Podcast[]>(
    CACHE_CONFIG.KEYS.TOP_PODCASTS,
    ITUNES_API.TOP_PODCASTS,
    transformTopPodcasts,
  );
}

/**
 * Fetch podcast detail including episodes by ID
 * Implements Cache-Aside pattern with 24h TTL
 * @param podcastId - iTunes podcast ID
 * @returns Podcast detail with episodes
 * @throws {ProxyError} When the API request fails
 * @throws {Error} When no podcast is found with the given ID
 */
export async function getPodcastDetail(podcastId: string): Promise<PodcastDetail> {
  return fetchWithCache<ITunesPodcastLookupResponse, PodcastDetail>(
    CACHE_CONFIG.KEYS.PODCAST_DETAIL(podcastId),
    ITUNES_API.PODCAST_LOOKUP(podcastId),
    (response) => transformPodcastDetail(response, podcastId),
  );
}
