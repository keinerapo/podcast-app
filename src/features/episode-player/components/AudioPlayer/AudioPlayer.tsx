import styles from './AudioPlayer.module.css';

export interface AudioPlayerProps {
  audioUrl: string;
  title: string;
}

export function AudioPlayer({ audioUrl, title }: AudioPlayerProps) {
  return (
    <div className={styles.container}>
      <audio className={styles.audio} controls src={audioUrl} title={title} preload="metadata">
        Tu navegador no soporta el elemento de audio.
      </audio>
    </div>
  );
}
