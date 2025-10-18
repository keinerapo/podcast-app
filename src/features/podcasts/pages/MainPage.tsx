import { PodcastList } from '@features/podcasts/components/PodcastList';
import { usePodcasts } from '@features/podcasts/hooks';

export const MainPage = () => {
  const { podcasts, error, isLoading } = usePodcasts();

  return (
    <div className="container">
      <main>
        <h1>Top Podcasts</h1>

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

        {!error && !isLoading && <PodcastList podcasts={podcasts} />}
      </main>
    </div>
  );
};
