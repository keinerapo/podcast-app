import { useMemo, useState } from 'react';
import { PodcastList } from '@features/podcasts/components/PodcastList';
import { SearchFilter } from '@features/podcasts/components/SearchFilter';
import { usePodcasts } from '@features/podcasts/hooks';
import { useDebounce } from '@shared/hooks';

export const MainPage = () => {
  const { podcasts, error, isLoading } = usePodcasts();
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const filteredPodcasts = useMemo(() => {
    if (!debouncedSearchQuery.trim()) {
      return podcasts;
    }

    const query = debouncedSearchQuery.toLowerCase();
    return podcasts.filter(
      (podcast) =>
        podcast.name.toLowerCase().includes(query) || podcast.author.toLowerCase().includes(query),
    );
  }, [podcasts, debouncedSearchQuery]);

  return (
    <div className="container">
      <main>
        {error && (
          <div
            role="alert"
            style={{
              padding: 'var(--spacing-md)',
              marginTop: 'var(--spacing-md)',
              backgroundColor: 'var(--color-error-light)',
              color: 'var(--color-error)',
              borderRadius: 'var(--radius-md)',
              textAlign: 'center',
            }}
          >
            <p style={{ margin: 0 }}>
              <strong>Error:</strong> {error}
            </p>
          </div>
        )}

        {!error && !isLoading && (
          <>
            <SearchFilter
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              resultsCount={filteredPodcasts.length}
              totalCount={podcasts.length}
            />
            <PodcastList podcasts={filteredPodcasts} />
          </>
        )}
      </main>
    </div>
  );
};
