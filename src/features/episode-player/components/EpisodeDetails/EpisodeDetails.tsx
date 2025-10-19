import DOMPurify from 'dompurify';

import styles from './EpisodeDetails.module.css';

export interface EpisodeDetailsProps {
  title: string;
  description: string;
}

export function EpisodeDetails({ title, description }: EpisodeDetailsProps) {
  const sanitizedDescription = DOMPurify.sanitize(description);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{title}</h2>
      <div
        className={styles.description}
        dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
      />
    </div>
  );
}
