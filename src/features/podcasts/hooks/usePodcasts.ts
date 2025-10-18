import { useEffect, useState } from 'react';
import { useLoading } from '@app/providers';
import { getTopPodcasts } from '@shared/services/api';
import type { Podcast } from '@shared/types/podcast.types';

interface UsePodcastsReturn {
  podcasts: Podcast[];
  error: string | null;
  isLoading: boolean;
}

/**
 * Hook to fetch top podcasts from iTunes API
 * @returns Object containing podcasts array, error state, and loading state
 */
export const usePodcasts = (): UsePodcastsReturn => {
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { setIsLoading: setGlobalLoading } = useLoading();

  useEffect(() => {
    const fetchPodcasts = async () => {
      try {
        setIsLoading(true);
        setGlobalLoading(true);
        setError(null);

        const data = await getTopPodcasts();
        setPodcasts(data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch podcasts';
        setError(errorMessage);
        console.error('Error fetching podcasts:', err);
      } finally {
        setIsLoading(false);
        setGlobalLoading(false);
      }
    };

    fetchPodcasts();
  }, [setGlobalLoading]);

  return { podcasts, error, isLoading };
};
