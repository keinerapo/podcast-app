import { useParams } from 'react-router-dom';
import { ErrorMessage } from '@shared/components/ErrorMessage';
import { PodcastSidebar } from '@features/podcast-detail/components/PodcastSidebar';
import { usePodcastDetail } from '@features/podcast-detail/hooks';

import { EpisodeDetails, AudioPlayer } from '../components';
import { useEpisode } from '../hooks';
import styles from './EpisodePlayerPage.module.css';

export function EpisodePlayerPage() {
  const { podcastId, episodeId } = useParams<{ podcastId: string; episodeId: string }>();
  const { podcastDetail, error } = usePodcastDetail(podcastId || '');
  const { episode, notFound } = useEpisode(podcastDetail, episodeId);

  if (!podcastId || !episodeId) {
    return (
      <div className="container">
        <ErrorMessage message="Podcast ID and Episode ID are required" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <ErrorMessage message={`Error loading episode: ${error}`} />
      </div>
    );
  }

  if (!podcastDetail) {
    return null;
  }

  if (notFound) {
    return (
      <div className="container">
        <ErrorMessage message="Episode not found" />
      </div>
    );
  }

  if (!episode) {
    return null;
  }

  return (
    <div className="container">
      <div className={styles.layout}>
        <aside className={styles.sidebar}>
          <PodcastSidebar podcast={podcastDetail} />
        </aside>
        <main className={styles.main}>
          <section className={styles.panel}>
            <EpisodeDetails title={episode.title} description={episode.description} />
            <AudioPlayer audioUrl={episode.audioUrl} title={episode.title} />
          </section>
        </main>
      </div>
    </div>
  );
}
