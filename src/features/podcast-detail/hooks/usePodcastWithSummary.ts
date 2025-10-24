import { useLocation } from 'react-router-dom';
import { CACHE_CONFIG } from '@shared/constants/api.constants';
import { cacheService } from '@shared/services/cache';
import type { Podcast, PodcastDetail } from '@entities/podcast';

/**
 * Hydrates podcast detail with summary from multiple sources
 * Priority order:
 * 1. Router state (if navigated from podcast list)
 * 2. Top podcasts cache (if podcast is in top 100)
 * 3. PodcastDetail.summary (from API lookup, may be undefined)
 *
 * @param podcastDetail - The podcast detail from API lookup
 * @returns PodcastDetail with summary hydrated when available
 */
export function usePodcastWithSummary(podcastDetail: PodcastDetail | null): PodcastDetail | null {
  const location = useLocation();

  if (!podcastDetail) {
    return null;
  }

  if (podcastDetail.summary) {
    return podcastDetail;
  }

  const podcastFromState = location.state?.podcast as Podcast | undefined;
  if (podcastFromState?.id === podcastDetail.id && podcastFromState.summary) {
    return {
      ...podcastDetail,
      summary: podcastFromState.summary,
    };
  }

  const topPodcasts = cacheService.get<Podcast[]>(CACHE_CONFIG.KEYS.TOP_PODCASTS);
  const podcastFromCache = topPodcasts?.find((p) => p.id === podcastDetail.id);

  if (podcastFromCache?.summary) {
    return {
      ...podcastDetail,
      summary: podcastFromCache.summary,
    };
  }

  return podcastDetail;
}
