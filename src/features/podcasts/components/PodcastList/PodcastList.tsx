import { PodcastCard } from '@features/podcasts/components/PodcastCard';
import type { Podcast } from '@shared/types/podcast.types';

import styles from './PodcastList.module.css';

interface PodcastListProps {
  podcasts: Podcast[];
}

export const PodcastList = ({ podcasts }: PodcastListProps) => {
  if (podcasts.length === 0) {
    return (
      <div className={styles.empty}>
        <p>No podcasts found. Try adjusting your search.</p>
      </div>
    );
  }

  return (
    <div className={styles.grid}>
      {podcasts.map((podcast) => (
        <PodcastCard key={podcast.id} podcast={podcast} />
      ))}
    </div>
  );
};
