import type { ReactNode } from 'react';

import styles from './Header.module.css';

export interface HeaderProps {
  logo: ReactNode;
  actions?: ReactNode;
}

/**
 * Generic Header Component
 * Provides a reusable header layout without app-specific logic
 * @param logo - Content for the left side (logo, title, etc.)
 * @param actions - Content for the right side (buttons, indicators, etc.)
 */
export function Header({ logo, actions }: HeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.logo}>{logo}</div>
        {actions && <div className={styles.actions}>{actions}</div>}
      </div>
    </header>
  );
}
