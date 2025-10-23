import { Link } from 'react-router-dom';
import { Header } from '@shared/ui';
import { LoadingIndicator } from '@shared/components/LoadingIndicator';

import styles from './AppHeader.module.css';

/**
 * AppHeader Component
 * Application-specific header implementation
 * Wraps the generic Header with app-specific logo and actions
 */
export function AppHeader() {
  const logo = (
    <Link to="/" className={styles.logoLink}>
      <h1 className={styles.title}>Podcaster</h1>
    </Link>
  );

  const actions = <LoadingIndicator />;

  return <Header logo={logo} actions={actions} />;
}
