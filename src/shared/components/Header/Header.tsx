import { Link } from 'react-router-dom';
import { LoadingIndicator } from '@shared/components/LoadingIndicator';

import styles from './Header.module.css';

export function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link to="/" className={styles.title}>
          <h1>Podcaster</h1>
        </Link>
        <LoadingIndicator />
      </div>
    </header>
  );
}
