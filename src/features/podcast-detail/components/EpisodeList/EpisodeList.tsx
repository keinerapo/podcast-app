import type { Episode } from '@shared/types/podcast.types';

import { EpisodeListItem } from '../EpisodeListItem';
import styles from './EpisodeList.module.css';

interface EpisodeListProps {
  episodes: Episode[];
  podcastId: string;
}

export function EpisodeList({ episodes, podcastId }: EpisodeListProps) {
  if (episodes.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.empty}>No episodes available</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Episodes: {episodes.length}</h2>
      </div>

      <div className={styles.tableHeader}>
        <div className={styles.titleHeader}>Title</div>
        <div className={styles.dateHeader}>Date</div>
        <div className={styles.durationHeader}>Duration</div>
      </div>

      <div className={styles.list}>
        {episodes.map((episode) => (
          <EpisodeListItem key={episode.id} episode={episode} podcastId={podcastId} />
        ))}
      </div>
    </div>
  );
}
