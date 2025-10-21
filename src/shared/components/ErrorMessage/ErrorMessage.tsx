import styles from './ErrorMessage.module.css';

interface ErrorMessageProps {
  message: string;
  className?: string;
}

/**
 * ErrorMessage Component
 * Displays an error message in a styled container
 * @param message - The error message to display
 * @param className - Optional additional CSS class
 */
export function ErrorMessage({ message, className }: ErrorMessageProps) {
  return (
    <div className={`${styles.container} ${className || ''}`} role="alert" aria-live="assertive">
      <p className={styles.message}>{message}</p>
    </div>
  );
}
