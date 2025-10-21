import { useParams } from 'react-router-dom';
import { ErrorMessage } from '@shared/components/ErrorMessage';

import { usePodcastDetail } from '../hooks';
import { PodcastSidebar } from '../components/PodcastSidebar';
import { EpisodeList } from '../components/EpisodeList';
import styles from './PodcastDetailPage.module.css';

export function PodcastDetailPage() {
  const { podcastId } = useParams<{ podcastId: string }>();

  const { podcastDetail, error, isLoading } = usePodcastDetail(podcastId || '');

  if (error) {
    return (
      <div className="container">
        <ErrorMessage message={`Error loading podcast: ${error}`} />
      </div>
    );
  }

  if (isLoading || !podcastDetail) {
    return null;
  }

  return (
    <div className="container">
      <div className={styles.layout}>
        <PodcastSidebar podcast={podcastDetail} />
        <EpisodeList episodes={podcastDetail.episodes} podcastId={podcastId || ''} />
      </div>
    </div>
  );
}
