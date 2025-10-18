import { Link } from 'react-router-dom';
import type { Podcast } from '@shared/types/podcast.types';

import styles from './PodcastCard.module.css';

interface PodcastCardProps {
  podcast: Podcast;
}

export const PodcastCard = ({ podcast }: PodcastCardProps) => {
  return (
    <Link to={`/podcast/${podcast.id}`} className={styles.card}>
      <article className={styles.content}>
        <div className={styles.imageWrapper}>
          <img
            src={podcast.image}
            alt={`${podcast.name} cover`}
            className={styles.image}
            loading="lazy"
          />
        </div>
        <div className={styles.info}>
          <h3 className={styles.title}>{podcast.name}</h3>
          <p className={styles.author}>Author: {podcast.author}</p>
        </div>
      </article>
    </Link>
  );
};
