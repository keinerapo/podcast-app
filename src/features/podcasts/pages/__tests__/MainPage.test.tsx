import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { Podcast } from '@entities/podcast';
import { usePodcasts } from '@features/podcasts/hooks';
import { renderWithRouter, mockPodcasts } from '@test/utils';

import { MainPage } from '../MainPage';

vi.mock('@features/podcasts/hooks', () => ({
  usePodcasts: vi.fn(),
}));

vi.mock('@shared/hooks', () => ({
  useDebounce: vi.fn((value) => value),
}));

vi.mock('@features/podcasts/components/PodcastList', () => ({
  PodcastList: ({ podcasts }: { podcasts: Podcast[] }) => (
    <div data-testid="podcast-list">
      {podcasts.map((p) => (
        <div key={p.id} data-testid={`podcast-${p.id}`}>
          {p.name}
        </div>
      ))}
    </div>
  ),
}));

vi.mock('@features/podcasts/components/SearchFilter', () => ({
  SearchFilter: ({
    searchQuery,
    onSearchChange,
    resultsCount,
    totalCount,
  }: {
    searchQuery: string;
    onSearchChange: (_query: string) => void;
    resultsCount: number;
    totalCount: number;
  }) => (
    <div data-testid="search-filter">
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Filter podcasts..."
        data-testid="search-input"
      />
      <span data-testid="results-count">
        {resultsCount} / {totalCount}
      </span>
    </div>
  ),
}));

const mockUsePodcasts = usePodcasts as ReturnType<typeof vi.fn>;

describe('MainPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Loading state', () => {
    it('should render nothing while loading', () => {
      mockUsePodcasts.mockReturnValue({
        podcasts: [],
        error: null,
        isLoading: true,
      });

      const { container } = renderWithRouter(<MainPage />);

      expect(container.querySelector('main')).toBeInTheDocument();
      expect(screen.queryByTestId('search-filter')).not.toBeInTheDocument();
      expect(screen.queryByTestId('podcast-list')).not.toBeInTheDocument();
    });
  });

  describe('Error state', () => {
    it('should display error message when fetch fails', () => {
      const errorMessage = 'Failed to fetch podcasts';
      mockUsePodcasts.mockReturnValue({
        podcasts: [],
        error: errorMessage,
        isLoading: false,
      });

      renderWithRouter(<MainPage />);

      const alert = screen.getByRole('alert');
      expect(alert).toBeInTheDocument();
      expect(alert).toHaveTextContent(errorMessage);
    });

    it('should not render search filter or podcast list when there is an error', () => {
      mockUsePodcasts.mockReturnValue({
        podcasts: [],
        error: 'Network error',
        isLoading: false,
      });

      renderWithRouter(<MainPage />);

      expect(screen.queryByTestId('search-filter')).not.toBeInTheDocument();
      expect(screen.queryByTestId('podcast-list')).not.toBeInTheDocument();
    });
  });

  describe('Success state', () => {
    it('should render search filter and podcast list when data is loaded', () => {
      mockUsePodcasts.mockReturnValue({
        podcasts: mockPodcasts,
        error: null,
        isLoading: false,
      });

      renderWithRouter(<MainPage />);

      expect(screen.getByTestId('search-filter')).toBeInTheDocument();
      expect(screen.getByTestId('podcast-list')).toBeInTheDocument();
    });

    it('should display all podcasts initially', () => {
      mockUsePodcasts.mockReturnValue({
        podcasts: mockPodcasts,
        error: null,
        isLoading: false,
      });

      renderWithRouter(<MainPage />);

      expect(screen.getByTestId('podcast-1')).toHaveTextContent('The Joe Rogan Experience');
      expect(screen.getByTestId('podcast-2')).toHaveTextContent('Crime Junkie');
      expect(screen.getByTestId('podcast-3')).toHaveTextContent('The Daily');
    });

    it('should show correct count in search filter', () => {
      mockUsePodcasts.mockReturnValue({
        podcasts: mockPodcasts,
        error: null,
        isLoading: false,
      });

      renderWithRouter(<MainPage />);

      expect(screen.getByTestId('results-count')).toHaveTextContent('3 / 3');
    });
  });

  describe('Search functionality', () => {
    it('should filter podcasts by name', async () => {
      mockUsePodcasts.mockReturnValue({
        podcasts: mockPodcasts,
        error: null,
        isLoading: false,
      });

      const user = userEvent.setup();
      renderWithRouter(<MainPage />);

      const searchInput = screen.getByTestId('search-input');
      await user.type(searchInput, 'joe');

      await waitFor(() => {
        expect(screen.getByTestId('podcast-1')).toBeInTheDocument();
        expect(screen.queryByTestId('podcast-2')).not.toBeInTheDocument();
        expect(screen.queryByTestId('podcast-3')).not.toBeInTheDocument();
      });
    });

    it('should filter podcasts by author', async () => {
      mockUsePodcasts.mockReturnValue({
        podcasts: mockPodcasts,
        error: null,
        isLoading: false,
      });

      const user = userEvent.setup();
      renderWithRouter(<MainPage />);

      const searchInput = screen.getByTestId('search-input');
      await user.type(searchInput, 'audiochuck');

      await waitFor(() => {
        expect(screen.queryByTestId('podcast-1')).not.toBeInTheDocument();
        expect(screen.getByTestId('podcast-2')).toBeInTheDocument();
        expect(screen.queryByTestId('podcast-3')).not.toBeInTheDocument();
      });
    });

    it('should be case-insensitive', async () => {
      mockUsePodcasts.mockReturnValue({
        podcasts: mockPodcasts,
        error: null,
        isLoading: false,
      });

      const user = userEvent.setup();
      renderWithRouter(<MainPage />);

      const searchInput = screen.getByTestId('search-input');
      await user.type(searchInput, 'DAILY');

      await waitFor(() => {
        expect(screen.queryByTestId('podcast-1')).not.toBeInTheDocument();
        expect(screen.queryByTestId('podcast-2')).not.toBeInTheDocument();
        expect(screen.getByTestId('podcast-3')).toBeInTheDocument();
      });
    });

    it('should show no results when search does not match', async () => {
      mockUsePodcasts.mockReturnValue({
        podcasts: mockPodcasts,
        error: null,
        isLoading: false,
      });

      const user = userEvent.setup();
      renderWithRouter(<MainPage />);

      const searchInput = screen.getByTestId('search-input');
      await user.type(searchInput, 'nonexistent');

      await waitFor(() => {
        expect(screen.queryByTestId('podcast-1')).not.toBeInTheDocument();
        expect(screen.queryByTestId('podcast-2')).not.toBeInTheDocument();
        expect(screen.queryByTestId('podcast-3')).not.toBeInTheDocument();
        expect(screen.getByTestId('results-count')).toHaveTextContent('0 / 3');
      });
    });

    it('should return all podcasts when search is cleared', async () => {
      mockUsePodcasts.mockReturnValue({
        podcasts: mockPodcasts,
        error: null,
        isLoading: false,
      });

      const user = userEvent.setup();
      renderWithRouter(<MainPage />);

      const searchInput = screen.getByTestId('search-input');

      await user.type(searchInput, 'joe');

      await waitFor(() => {
        expect(screen.getByTestId('results-count')).toHaveTextContent('1 / 3');
      });

      await user.clear(searchInput);

      await waitFor(() => {
        expect(screen.getByTestId('podcast-1')).toBeInTheDocument();
        expect(screen.getByTestId('podcast-2')).toBeInTheDocument();
        expect(screen.getByTestId('podcast-3')).toBeInTheDocument();
        expect(screen.getByTestId('results-count')).toHaveTextContent('3 / 3');
      });
    });

    it('should handle partial matches', async () => {
      mockUsePodcasts.mockReturnValue({
        podcasts: mockPodcasts,
        error: null,
        isLoading: false,
      });

      const user = userEvent.setup();
      renderWithRouter(<MainPage />);

      const searchInput = screen.getByTestId('search-input');
      await user.type(searchInput, 'the');

      await waitFor(() => {
        expect(screen.getByTestId('podcast-1')).toBeInTheDocument();
        expect(screen.queryByTestId('podcast-2')).not.toBeInTheDocument();
        expect(screen.getByTestId('podcast-3')).toBeInTheDocument();
        expect(screen.getByTestId('results-count')).toHaveTextContent('2 / 3');
      });
    });

    it('should search with whitespace (no trim on query)', async () => {
      mockUsePodcasts.mockReturnValue({
        podcasts: mockPodcasts,
        error: null,
        isLoading: false,
      });

      const user = userEvent.setup();
      renderWithRouter(<MainPage />);
      const searchInput = screen.getByTestId('search-input');
      await user.type(searchInput, '  joe  ');

      await waitFor(() => {
        expect(screen.queryByTestId('podcast-1')).not.toBeInTheDocument();
        expect(screen.queryByTestId('podcast-2')).not.toBeInTheDocument();
        expect(screen.queryByTestId('podcast-3')).not.toBeInTheDocument();
        expect(screen.getByTestId('results-count')).toHaveTextContent('0 / 3');
      });
    });
  });

  describe('Empty state', () => {
    it('should handle empty podcasts array', () => {
      mockUsePodcasts.mockReturnValue({
        podcasts: [],
        error: null,
        isLoading: false,
      });

      renderWithRouter(<MainPage />);

      expect(screen.getByTestId('search-filter')).toBeInTheDocument();
      expect(screen.getByTestId('podcast-list')).toBeInTheDocument();
      expect(screen.getByTestId('results-count')).toHaveTextContent('0 / 0');
    });
  });
});
