import { useParams } from 'react-router-dom';
import { PodcastSidebar } from '@features/podcast-detail/components/PodcastSidebar';
import { usePodcastDetail } from '@features/podcast-detail/hooks';

import { EpisodeDetails, AudioPlayer } from '../components';
import styles from './EpisodePlayerPage.module.css';

export function EpisodePlayerPage() {
  const { podcastId, episodeId } = useParams<{ podcastId: string; episodeId: string }>();
  const { podcastDetail, error } = usePodcastDetail(podcastId!);

  if (error) {
    return (
      <div className="container">
        <p className={styles.error}>Error al cargar el episodio: {error}</p>
      </div>
    );
  }

  if (!podcastDetail) {
    return null;
  }

  const episode = podcastDetail.episodes.find((ep) => ep.id === episodeId);

  if (!episode) {
    return (
      <div className="container">
        <p className={styles.error}>Episodio no encontrado</p>
      </div>
    );
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
