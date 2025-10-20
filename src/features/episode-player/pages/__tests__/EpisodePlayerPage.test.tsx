import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { EpisodePlayerPage } from '../EpisodePlayerPage';
import type { PodcastDetail, Episode } from '@shared/types/podcast.types';

vi.mock('@features/podcast-detail/hooks', () => ({
  usePodcastDetail: vi.fn(),
}));

vi.mock('@features/podcast-detail/components/PodcastSidebar', () => ({
  PodcastSidebar: ({ podcast }: { podcast: PodcastDetail }) => (
    <aside data-testid="podcast-sidebar">
      <h2>{podcast.name}</h2>
    </aside>
  ),
}));

vi.mock('../../components', () => ({
  EpisodeDetails: ({ title, description }: { title: string; description: string }) => (
    <div data-testid="episode-details">
      <h1>{title}</h1>
      <p>{description}</p>
    </div>
  ),
  AudioPlayer: ({ audioUrl, title }: { audioUrl: string; title: string }) => (
    <div data-testid="audio-player" data-audio-url={audioUrl} data-title={title}>
      Audio Player
    </div>
  ),
}));

import { usePodcastDetail } from '@features/podcast-detail/hooks';

const mockUsePodcastDetail = usePodcastDetail as ReturnType<typeof vi.fn>;

const mockEpisodes: Episode[] = [
  {
    id: 'ep1',
    title: 'Episode 1: Getting Started',
    description: 'This is the first episode where we introduce the podcast.',
    duration: 3600000,
    publishedDate: '2024-01-01',
    audioUrl: 'https://example.com/audio/ep1.mp3',
  },
  {
    id: 'ep2',
    title: 'Episode 2: Advanced Topics',
    description: 'We dive deeper into advanced topics.',
    duration: 4200000,
    publishedDate: '2024-01-08',
    audioUrl: 'https://example.com/audio/ep2.mp3',
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

const renderPage = (podcastId = 'podcast123', episodeId = 'ep1') => {
  window.history.pushState({}, '', `/podcast/${podcastId}/episode/${episodeId}`);
  return render(
    <BrowserRouter>
      <Routes>
        <Route path="/podcast/:podcastId/episode/:episodeId" element={<EpisodePlayerPage />} />
      </Routes>
    </BrowserRouter>
  );
};

describe('EpisodePlayerPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Error state', () => {
    it('should display error message when podcast fetch fails', () => {
      const errorMessage = 'Failed to load podcast';
      mockUsePodcastDetail.mockReturnValue({
        podcastDetail: null,
        error: errorMessage,
        isLoading: false,
      });

      renderPage();

      expect(screen.getByText(`Error al cargar el episodio: ${errorMessage}`)).toBeInTheDocument();
    });

    it('should not render components when there is an error', () => {
      mockUsePodcastDetail.mockReturnValue({
        podcastDetail: null,
        error: 'Network error',
        isLoading: false,
      });

      renderPage();

      expect(screen.queryByTestId('podcast-sidebar')).not.toBeInTheDocument();
      expect(screen.queryByTestId('episode-details')).not.toBeInTheDocument();
      expect(screen.queryByTestId('audio-player')).not.toBeInTheDocument();
    });
  });

  describe('Loading/null state', () => {
    it('should render nothing when podcastDetail is not available', () => {
      mockUsePodcastDetail.mockReturnValue({
        podcastDetail: null,
        error: null,
        isLoading: true,
      });

      const { container } = renderPage();

      expect(container.querySelector('.container')).not.toBeInTheDocument();
    });
  });

  describe('Episode not found', () => {
    it('should display error when episode does not exist', () => {
      mockUsePodcastDetail.mockReturnValue({
        podcastDetail: mockPodcastDetail,
        error: null,
        isLoading: false,
      });

      renderPage('podcast123', 'nonexistent-episode');

      expect(screen.getByText('Episodio no encontrado')).toBeInTheDocument();
    });

    it('should not render player when episode is not found', () => {
      mockUsePodcastDetail.mockReturnValue({
        podcastDetail: mockPodcastDetail,
        error: null,
        isLoading: false,
      });

      renderPage('podcast123', 'invalid-id');

      expect(screen.queryByTestId('audio-player')).not.toBeInTheDocument();
      expect(screen.queryByTestId('episode-details')).not.toBeInTheDocument();
    });
  });

  describe('Success state', () => {
    it('should render all components when episode is found', () => {
      mockUsePodcastDetail.mockReturnValue({
        podcastDetail: mockPodcastDetail,
        error: null,
        isLoading: false,
      });

      renderPage('podcast123', 'ep1');

      expect(screen.getByTestId('podcast-sidebar')).toBeInTheDocument();
      expect(screen.getByTestId('episode-details')).toBeInTheDocument();
      expect(screen.getByTestId('audio-player')).toBeInTheDocument();
    });

    it('should display correct episode title and description', () => {
      mockUsePodcastDetail.mockReturnValue({
        podcastDetail: mockPodcastDetail,
        error: null,
        isLoading: false,
      });

      renderPage('podcast123', 'ep1');

      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
        'Episode 1: Getting Started'
      );
      expect(
        screen.getByText('This is the first episode where we introduce the podcast.')
      ).toBeInTheDocument();
    });

    it('should pass correct audio URL to player', () => {
      mockUsePodcastDetail.mockReturnValue({
        podcastDetail: mockPodcastDetail,
        error: null,
        isLoading: false,
      });

      renderPage('podcast123', 'ep1');

      const audioPlayer = screen.getByTestId('audio-player');
      expect(audioPlayer).toHaveAttribute('data-audio-url', 'https://example.com/audio/ep1.mp3');
      expect(audioPlayer).toHaveAttribute('data-title', 'Episode 1: Getting Started');
    });

    it('should pass podcast to sidebar', () => {
      mockUsePodcastDetail.mockReturnValue({
        podcastDetail: mockPodcastDetail,
        error: null,
        isLoading: false,
      });

      renderPage('podcast123', 'ep1');

      const sidebar = screen.getByTestId('podcast-sidebar');
      expect(sidebar).toHaveTextContent('Test Podcast');
    });
  });

  describe('Different episodes', () => {
    it('should render second episode correctly', () => {
      mockUsePodcastDetail.mockReturnValue({
        podcastDetail: mockPodcastDetail,
        error: null,
        isLoading: false,
      });

      renderPage('podcast123', 'ep2');

      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
        'Episode 2: Advanced Topics'
      );
      expect(screen.getByText('We dive deeper into advanced topics.')).toBeInTheDocument();

      const audioPlayer = screen.getByTestId('audio-player');
      expect(audioPlayer).toHaveAttribute('data-audio-url', 'https://example.com/audio/ep2.mp3');
    });
  });

  describe('Route params', () => {
    it('should work with different podcast IDs', () => {
      mockUsePodcastDetail.mockReturnValue({
        podcastDetail: mockPodcastDetail,
        error: null,
        isLoading: false,
      });

      renderPage('different-podcast', 'ep1');

      expect(mockUsePodcastDetail).toHaveBeenCalledWith('different-podcast');
    });

    it('should handle episode ID correctly from route', () => {
      mockUsePodcastDetail.mockReturnValue({
        podcastDetail: mockPodcastDetail,
        error: null,
        isLoading: false,
      });

      renderPage('podcast123', 'ep2');

      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
        'Episode 2: Advanced Topics'
      );
    });
  });

  describe('Layout structure', () => {
    it('should render with correct layout classes', () => {
      mockUsePodcastDetail.mockReturnValue({
        podcastDetail: mockPodcastDetail,
        error: null,
        isLoading: false,
      });

      renderPage();

      const container = screen.getByTestId('podcast-sidebar').closest('.container');
      expect(container).toBeInTheDocument();

      const sidebar = screen.getByTestId('podcast-sidebar');
      expect(sidebar.tagName).toBe('ASIDE');
    });

    it('should render main content in correct structure', () => {
      mockUsePodcastDetail.mockReturnValue({
        podcastDetail: mockPodcastDetail,
        error: null,
        isLoading: false,
      });

      renderPage();

      const episodeDetails = screen.getByTestId('episode-details');
      const audioPlayer = screen.getByTestId('audio-player');

      expect(episodeDetails).toBeInTheDocument();
      expect(audioPlayer).toBeInTheDocument();
    });
  });

  describe('Edge cases', () => {
    it('should handle podcast with single episode', () => {
      const singleEpisodePodcast: PodcastDetail = {
        ...mockPodcastDetail,
        episodes: [mockEpisodes[0]!],
      };

      mockUsePodcastDetail.mockReturnValue({
        podcastDetail: singleEpisodePodcast,
        error: null,
        isLoading: false,
      });

      renderPage('podcast123', 'ep1');

      expect(screen.getByTestId('episode-details')).toBeInTheDocument();
      expect(screen.getByTestId('audio-player')).toBeInTheDocument();
    });

    it('should handle long episode descriptions', () => {
      const longDescription = 'A'.repeat(1000);
      const episodeWithLongDesc: Episode = {
        ...mockEpisodes[0]!,
        description: longDescription,
      };

      const podcastWithLongDesc: PodcastDetail = {
        ...mockPodcastDetail,
        episodes: [episodeWithLongDesc],
      };

      mockUsePodcastDetail.mockReturnValue({
        podcastDetail: podcastWithLongDesc,
        error: null,
        isLoading: false,
      });

      renderPage('podcast123', 'ep1');

      expect(screen.getByText(longDescription)).toBeInTheDocument();
    });

    it('should handle special characters in episode title', () => {
      const specialTitle = 'Episode with "quotes" & <special> characters';
      const episodeWithSpecialChars: Episode = {
        ...mockEpisodes[0]!,
        title: specialTitle,
      };

      const podcastWithSpecialChars: PodcastDetail = {
        ...mockPodcastDetail,
        episodes: [episodeWithSpecialChars],
      };

      mockUsePodcastDetail.mockReturnValue({
        podcastDetail: podcastWithSpecialChars,
        error: null,
        isLoading: false,
      });

      renderPage('podcast123', 'ep1');

      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(specialTitle);
    });
  });
});
