import { Link } from 'react-router-dom';
import type { Episode } from '@shared/types/podcast.types';
import { formatDate, formatDuration } from '@shared/utils';

import styles from './EpisodeListItem.module.css';

interface EpisodeListItemProps {
  episode: Episode;
  podcastId: string;
}

export function EpisodeListItem({ episode, podcastId }: EpisodeListItemProps) {
  return (
    <Link
      to={`/podcast/${podcastId}/episode/${episode.id}`}
      className={styles.item}
      aria-label={`Play episode: ${episode.title}`}
    >
      <div className={styles.titleCell}>
        <h3 className={styles.title}>{episode.title}</h3>
      </div>
      <div className={styles.dateCell}>
        <time dateTime={episode.publishedDate}>{formatDate(episode.publishedDate)}</time>
      </div>
      <div className={styles.durationCell}>{formatDuration(episode.duration)}</div>
    </Link>
  );
}
