import { Link } from 'react-router-dom';
import type { PodcastDetail } from '@entities/podcast';

import styles from './PodcastSidebar.module.css';

interface PodcastSidebarProps {
  podcast: PodcastDetail;
}

export function PodcastSidebar({ podcast }: PodcastSidebarProps) {
  const podcastUrl = `/podcast/${podcast.id}`;

  return (
    <aside className={styles.sidebar}>
      <Link
        to={podcastUrl}
        className={styles.imageLink}
        aria-label={`View ${podcast.name} podcast details`}
      >
        <div className={styles.imageWrapper}>
          <img src={podcast.image} alt={podcast.name} className={styles.image} loading="lazy" />
        </div>
      </Link>

      <Link
        to={podcastUrl}
        className={styles.infoLink}
        aria-label={`View ${podcast.name} podcast details`}
      >
        <div className={styles.info}>
          <h2 className={styles.title}>{podcast.name}</h2>
          <p className={styles.author}>by {podcast.author}</p>
        </div>
      </Link>

      {podcast.summary && (
        <div className={styles.descriptionSection}>
          <h3 className={styles.descriptionTitle}>Description:</h3>
          <p className={styles.description}>{podcast.summary}</p>
        </div>
      )}
    </aside>
  );
}
