import { useMemo, useState } from 'react';
import { PodcastList } from '@features/podcasts/components/PodcastList';
import { SearchFilter } from '@features/podcasts/components/SearchFilter';
import { usePodcasts } from '@features/podcasts/hooks';
import { useDebounce } from '@shared/hooks';
import { ErrorMessage } from '@shared/components/ErrorMessage';

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
        {error && <ErrorMessage message={error} />}

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
