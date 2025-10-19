import type { ChangeEvent } from 'react';

import styles from './SearchFilter.module.css';

interface SearchFilterProps {
  searchQuery: string;
  // eslint-disable-next-line no-unused-vars
  onSearchChange: (query: string) => void;
  resultsCount: number;
  totalCount: number;
}

export const SearchFilter = ({
  searchQuery,
  onSearchChange,
  resultsCount,
  totalCount,
}: SearchFilterProps) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e.target.value);
  };

  return (
    <div className={styles.container}>
      <div className={styles.counter} aria-live="polite" aria-atomic="true">
        <span className={styles.count}>{resultsCount}</span>
      </div>

      <div className={styles.inputWrapper}>
        <label htmlFor="podcast-search" className="sr-only">
          Filter podcasts by name or author
        </label>
        <input
          id="podcast-search"
          type="text"
          className={styles.input}
          placeholder="Filter podcasts..."
          value={searchQuery}
          onChange={handleChange}
          aria-label="Filter podcasts by name or author"
          aria-describedby="search-results-count"
        />
        <span id="search-results-count" className="sr-only">
          Showing {resultsCount} of {totalCount} podcasts
        </span>
      </div>
    </div>
  );
};
