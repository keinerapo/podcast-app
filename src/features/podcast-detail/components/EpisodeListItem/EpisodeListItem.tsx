import { Link } from 'react-router-dom';
import type { Episode } from '@shared/types/podcast.types';
import { formatDate, formatDuration } from '@shared/utils';

import styles from './EpisodeListItem.module.css';

interface EpisodeListItemProps {
  episode: Episode;
  podcastId: string;
}

export function EpisodeListItem({ episode, podcastId }: EpisodeListItemProps) {
  const to = `/podcast/${podcastId}/episode/${episode.id}`;

  return (
    <div className={styles.row}>
      <div className={styles.titleCell}>
        <Link
          to={to}
          className={styles.link}
          aria-label={`Open episode: ${episode.title}`}
        >
          {episode.title}
        </Link>
      </div>

      <div className={styles.dateCell}>
        <time dateTime={episode.publishedDate}>
          {formatDate(episode.publishedDate)}
        </time>
      </div>

      <div className={styles.durationCell}>
        {formatDuration(episode.duration)}
      </div>
    </div>
  );
}

