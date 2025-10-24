import { useMemo } from 'react';
import type { PodcastDetail } from '@entities/podcast';
import type { Episode } from '@entities/episode';

interface UseEpisodeReturn {
  episode: Episode | undefined;
  notFound: boolean;
}

/**
 * Custom hook to find an episode by ID within a podcast's episodes
 * @param podcastDetail - The podcast detail containing episodes
 * @param episodeId - The ID of the episode to find
 * @returns Object containing the episode (if found) and a notFound flag
 */
export function useEpisode(
  podcastDetail: PodcastDetail | null,
  episodeId: string | undefined,
): UseEpisodeReturn {
  const result = useMemo(() => {
    if (!podcastDetail || !episodeId) {
      return { episode: undefined, notFound: false };
    }

    const episode = podcastDetail.episodes.find((ep) => ep.id === episodeId);

    return {
      episode,
      notFound: !episode,
    };
  }, [podcastDetail, episodeId]);

  return result;
}
