import { useLoading } from '@app/providers';

import styles from './LoadingIndicator.module.css';

/**
 * LoadingIndicator Component
 * Displays a loading spinner when isLoading is true
 * Connected to LoadingContext for global loading state
 */
export function LoadingIndicator() {
  const { isLoading } = useLoading();

  if (!isLoading) {
    return null;
  }

  return (
    <div className={styles.indicator} role="status" aria-live="polite" aria-label="Loading">
      <div className={styles.spinner}></div>
    </div>
  );
}
