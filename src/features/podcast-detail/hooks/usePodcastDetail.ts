import { useEffect, useState } from 'react';
import { getPodcastDetail } from '@shared/services/api';
import { useLoading } from '@app/providers';
import type { PodcastDetail } from '@entities/podcast';

export function usePodcastDetail(podcastId: string) {
  const [podcastDetail, setPodcastDetail] = useState<PodcastDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { setIsLoading: setGlobalLoading } = useLoading();

  useEffect(() => {
    let cancelled = false;

    async function fetchPodcastDetail() {
      try {
        setIsLoading(true);
        setGlobalLoading(true);
        setError(null);

        const detail = await getPodcastDetail(podcastId);

        if (!cancelled) {
          setPodcastDetail(detail);
        }
      } catch (err) {
        if (!cancelled) {
          const errorMessage =
            err instanceof Error ? err.message : 'Failed to fetch podcast details';
          setError(errorMessage);
          console.error('Error fetching podcast detail:', err);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
          setGlobalLoading(false);
        }
      }
    }

    fetchPodcastDetail();

    return () => {
      cancelled = true;
    };
  }, [podcastId, setGlobalLoading]);

  return { podcastDetail, error, isLoading };
}
