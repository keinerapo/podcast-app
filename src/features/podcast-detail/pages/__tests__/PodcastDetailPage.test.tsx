import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import type { PodcastDetail, Episode } from '@shared/types/podcast.types';

import { PodcastDetailPage } from '../PodcastDetailPage';
import { usePodcastDetail } from '../../hooks';

vi.mock('../../hooks', () => ({
  usePodcastDetail: vi.fn(),
}));

vi.mock('../../components/PodcastSidebar', () => ({
  PodcastSidebar: ({ podcast }: { podcast: PodcastDetail }) => (
    <aside data-testid="podcast-sidebar">
      <h2>{podcast.name}</h2>
      <p>{podcast.author}</p>
    </aside>
  ),
}));

vi.mock('../../components/EpisodeList', () => ({
  EpisodeList: ({ episodes, podcastId }: { episodes: Episode[]; podcastId: string }) => (
    <div data-testid="episode-list" data-podcast-id={podcastId}>
      {episodes.map((ep) => (
        <div key={ep.id} data-testid={`episode-${ep.id}`}>
          {ep.title}
        </div>
      ))}
    </div>
  ),
}));

const mockUsePodcastDetail = usePodcastDetail as ReturnType<typeof vi.fn>;

const mockEpisodes: Episode[] = [
  {
    id: 'ep1',
    title: 'Episode 1: Introduction',
    description: 'First episode',
    duration: 3600000,
    publishedDate: '2024-01-01',
    audioUrl: 'https://example.com/ep1.mp3',
  },
  {
    id: 'ep2',
    title: 'Episode 2: Deep Dive',
    description: 'Second episode',
    duration: 4200000,
    publishedDate: '2024-01-08',
    audioUrl: 'https://example.com/ep2.mp3',
  },
];

const mockPodcastDetail: PodcastDetail = {
  id: 'podcast123',
  name: 'Test Podcast',
  author: 'Test Author',
  image: 'https://example.com/podcast.jpg',
  summary: 'A great test podcast',
  episodes: mockEpisodes,
};

const renderPage = (podcastId = 'podcast123') => {
  window.history.pushState({}, '', `/podcast/${podcastId}`);
  return render(
    <BrowserRouter>
      <Routes>
        <Route path="/podcast/:podcastId" element={<PodcastDetailPage />} />
      </Routes>
    </BrowserRouter>,
  );
};

describe('PodcastDetailPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Loading state', () => {
    it('should render nothing while loading', () => {
      mockUsePodcastDetail.mockReturnValue({
        podcastDetail: null,
        error: null,
        isLoading: true,
      });

      const { container } = renderPage();

      expect(container.querySelector('.container')).not.toBeInTheDocument();
    });

    it('should render nothing when podcastDetail is not available yet', () => {
      mockUsePodcastDetail.mockReturnValue({
        podcastDetail: null,
        error: null,
        isLoading: false,
      });

      const { container } = renderPage();

      expect(container.querySelector('.container')).not.toBeInTheDocument();
    });
  });

  describe('Error state', () => {
    it('should display error message when fetch fails', () => {
      const errorMessage = 'Failed to load podcast details';
      mockUsePodcastDetail.mockReturnValue({
        podcastDetail: null,
        error: errorMessage,
        isLoading: false,
      });

      renderPage();

      expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Error loading podcast');
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

    it('should not render sidebar or episode list when there is an error', () => {
      mockUsePodcastDetail.mockReturnValue({
        podcastDetail: null,
        error: 'Network error',
        isLoading: false,
      });

      renderPage();

      expect(screen.queryByTestId('podcast-sidebar')).not.toBeInTheDocument();
      expect(screen.queryByTestId('episode-list')).not.toBeInTheDocument();
    });

    it('should style error message appropriately', () => {
      mockUsePodcastDetail.mockReturnValue({
        podcastDetail: null,
        error: 'Error',
        isLoading: false,
      });

      renderPage();

      const errorContainer = screen.getByRole('heading', { level: 2 }).parentElement;
      expect(errorContainer).toHaveStyle({
        padding: '2rem',
        textAlign: 'center',
      });
    });
  });

  describe('Success state', () => {
    it('should render sidebar and episode list when data is loaded', () => {
      mockUsePodcastDetail.mockReturnValue({
        podcastDetail: mockPodcastDetail,
        error: null,
        isLoading: false,
      });

      renderPage();

      expect(screen.getByTestId('podcast-sidebar')).toBeInTheDocument();
      expect(screen.getByTestId('episode-list')).toBeInTheDocument();
    });

    it('should pass podcast data to sidebar', () => {
      mockUsePodcastDetail.mockReturnValue({
        podcastDetail: mockPodcastDetail,
        error: null,
        isLoading: false,
      });

      renderPage();

      const sidebar = screen.getByTestId('podcast-sidebar');
      expect(sidebar).toHaveTextContent('Test Podcast');
      expect(sidebar).toHaveTextContent('Test Author');
    });

    it('should pass episodes to episode list', () => {
      mockUsePodcastDetail.mockReturnValue({
        podcastDetail: mockPodcastDetail,
        error: null,
        isLoading: false,
      });

      renderPage();

      expect(screen.getByTestId('episode-ep1')).toHaveTextContent('Episode 1: Introduction');
      expect(screen.getByTestId('episode-ep2')).toHaveTextContent('Episode 2: Deep Dive');
    });

    it('should pass podcastId to episode list', () => {
      mockUsePodcastDetail.mockReturnValue({
        podcastDetail: mockPodcastDetail,
        error: null,
        isLoading: false,
      });

      renderPage('podcast123');

      const episodeList = screen.getByTestId('episode-list');
      expect(episodeList).toHaveAttribute('data-podcast-id', 'podcast123');
    });

    it('should render container with correct layout', () => {
      mockUsePodcastDetail.mockReturnValue({
        podcastDetail: mockPodcastDetail,
        error: null,
        isLoading: false,
      });

      renderPage();

      const container = screen.getByTestId('podcast-sidebar').closest('.container');
      expect(container).toBeInTheDocument();
    });
  });

  describe('Empty episodes', () => {
    it('should handle podcast with no episodes', () => {
      const podcastWithNoEpisodes: PodcastDetail = {
        ...mockPodcastDetail,
        episodes: [],
      };

      mockUsePodcastDetail.mockReturnValue({
        podcastDetail: podcastWithNoEpisodes,
        error: null,
        isLoading: false,
      });

      renderPage();

      expect(screen.getByTestId('podcast-sidebar')).toBeInTheDocument();
      expect(screen.getByTestId('episode-list')).toBeInTheDocument();

      const episodeList = screen.getByTestId('episode-list');
      expect(episodeList.children.length).toBe(0);
    });
  });

  describe('Multiple episodes', () => {
    it('should render all episodes correctly', () => {
      const manyEpisodes: Episode[] = Array.from({ length: 50 }, (_, i) => ({
        id: `ep${i + 1}`,
        title: `Episode ${i + 1}`,
        description: `Description ${i + 1}`,
        duration: 3600000,
        publishedDate: `2024-01-${String(i + 1).padStart(2, '0')}`,
        audioUrl: `https://example.com/ep${i + 1}.mp3`,
      }));

      const podcastWithManyEpisodes: PodcastDetail = {
        ...mockPodcastDetail,
        episodes: manyEpisodes,
      };

      mockUsePodcastDetail.mockReturnValue({
        podcastDetail: podcastWithManyEpisodes,
        error: null,
        isLoading: false,
      });

      renderPage();

      manyEpisodes.forEach((episode) => {
        expect(screen.getByTestId(`episode-${episode.id}`)).toBeInTheDocument();
      });
    });
  });

  describe('Route params', () => {
    it('should work with different podcast IDs', () => {
      mockUsePodcastDetail.mockReturnValue({
        podcastDetail: mockPodcastDetail,
        error: null,
        isLoading: false,
      });

      renderPage('different-podcast-id');

      expect(mockUsePodcastDetail).toHaveBeenCalledWith('different-podcast-id');
    });
  });
});
