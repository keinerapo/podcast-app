import { useParams } from 'react-router-dom';

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
        <div
          style={{
            padding: '2rem',
            textAlign: 'center',
            color: 'var(--color-error)',
            backgroundColor: 'var(--color-gray-50)',
            borderRadius: 'var(--radius-md)',
            margin: '2rem 0',
          }}
        >
          <h2>Error loading podcast</h2>
          <p>{error}</p>
        </div>
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
