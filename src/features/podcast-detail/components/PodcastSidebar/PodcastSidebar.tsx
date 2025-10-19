import type { PodcastDetail } from '@shared/types/podcast.types';

import styles from './PodcastSidebar.module.css';

interface PodcastSidebarProps {
  podcast: PodcastDetail;
}

export function PodcastSidebar({ podcast }: PodcastSidebarProps) {
  console.log(podcast);
  return (
    <aside className={styles.sidebar}>
      <div className={styles.imageWrapper}>
        <img src={podcast.image} alt={podcast.name} className={styles.image} loading="lazy" />
      </div>

      <div className={styles.info}>
        <h2 className={styles.title}>{podcast.name}</h2>
        <p className={styles.author}>by {podcast.author}</p>
      </div>

      {podcast.summary && (
        <div className={styles.descriptionSection}>
          <h3 className={styles.descriptionTitle}>Description:</h3>
          <p className={styles.description}>{podcast.summary}</p>
        </div>
      )}
    </aside>
  );
}
