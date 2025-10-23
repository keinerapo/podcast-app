import { useParams } from 'react-router-dom';
import { ErrorMessage } from '@shared/components/ErrorMessage';

import { usePodcastDetail, usePodcastWithSummary } from '../hooks';
import { PodcastSidebar } from '../components/PodcastSidebar';
import { EpisodeList } from '../components/EpisodeList';
import styles from './PodcastDetailPage.module.css';

export function PodcastDetailPage() {
  const { podcastId } = useParams<{ podcastId: string }>();
  const { podcastDetail, error, isLoading } = usePodcastDetail(podcastId || '');
  const podcastWithSummary = usePodcastWithSummary(podcastDetail);

  if (!podcastId) {
    return (
      <div className="container">
        <ErrorMessage message="Podcast ID is required" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <ErrorMessage message={`Error loading podcast: ${error}`} />
      </div>
    );
  }

  if (isLoading || !podcastWithSummary) {
    return null;
  }

  return (
    <div className="container">
      <div className={styles.layout}>
        <PodcastSidebar podcast={podcastWithSummary} />
        <EpisodeList episodes={podcastWithSummary.episodes} podcastId={podcastId} />
      </div>
    </div>
  );
}
