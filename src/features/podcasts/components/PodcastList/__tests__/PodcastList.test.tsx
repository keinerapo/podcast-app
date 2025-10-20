import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import type { ReactElement } from 'react';
import type { Podcast } from '@shared/types/podcast.types';

import { PodcastList } from '../PodcastList';

vi.mock('@features/podcasts/components/PodcastCard', () => ({
  PodcastCard: ({ podcast }: { podcast: Podcast }) => (
    <div data-testid={`podcast-card-${podcast.id}`}>{podcast.name}</div>
  ),
}));

const renderWithRouter = (component: ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('PodcastList', () => {
  const mockPodcasts: Podcast[] = [
    {
      id: '1',
      name: 'Podcast 1',
      author: 'Author 1',
      image: 'https://example.com/image1.jpg',
      summary: 'Summary 1',
    },
    {
      id: '2',
      name: 'Podcast 2',
      author: 'Author 2',
      image: 'https://example.com/image2.jpg',
      summary: 'Summary 2',
    },
    {
      id: '3',
      name: 'Podcast 3',
      author: 'Author 3',
      image: 'https://example.com/image3.jpg',
      summary: 'Summary 3',
    },
  ];

  it('should render all podcasts in the list', () => {
    renderWithRouter(<PodcastList podcasts={mockPodcasts} />);

    mockPodcasts.forEach((podcast) => {
      const card = screen.getByTestId(`podcast-card-${podcast.id}`);
      expect(card).toBeInTheDocument();
      expect(card).toHaveTextContent(podcast.name);
    });
  });

  it('should render correct number of podcast cards', () => {
    renderWithRouter(<PodcastList podcasts={mockPodcasts} />);

    const cards = screen.getAllByTestId(/podcast-card-/);
    expect(cards).toHaveLength(mockPodcasts.length);
  });

  it('should display empty state message when no podcasts', () => {
    renderWithRouter(<PodcastList podcasts={[]} />);

    const emptyMessage = screen.getByText(/no podcasts found/i);
    expect(emptyMessage).toBeInTheDocument();
    expect(emptyMessage).toHaveTextContent('Try adjusting your search');
  });

  it('should not render podcast cards when list is empty', () => {
    renderWithRouter(<PodcastList podcasts={[]} />);

    const cards = screen.queryAllByTestId(/podcast-card-/);
    expect(cards).toHaveLength(0);
  });

  it('should render single podcast correctly', () => {
    const singlePodcast = [mockPodcasts[0]!];
    renderWithRouter(<PodcastList podcasts={singlePodcast} />);

    const card = screen.getByTestId(`podcast-card-${singlePodcast[0]!.id}`);
    expect(card).toBeInTheDocument();
  });

  it('should use podcast id as key for list items', () => {
    renderWithRouter(<PodcastList podcasts={mockPodcasts} />);

    mockPodcasts.forEach((podcast) => {
      expect(screen.getByTestId(`podcast-card-${podcast.id}`)).toBeInTheDocument();
    });
  });

  it('should handle large number of podcasts', () => {
    const manyPodcasts: Podcast[] = Array.from({ length: 100 }, (_, i) => ({
      id: `${i + 1}`,
      name: `Podcast ${i + 1}`,
      author: `Author ${i + 1}`,
      image: `https://example.com/image${i + 1}.jpg`,
      summary: `Summary ${i + 1}`,
    }));

    renderWithRouter(<PodcastList podcasts={manyPodcasts} />);

    const cards = screen.getAllByTestId(/podcast-card-/);
    expect(cards).toHaveLength(100);
  });

  it('should maintain order of podcasts', () => {
    renderWithRouter(<PodcastList podcasts={mockPodcasts} />);

    const cards = screen.getAllByTestId(/podcast-card-/);

    cards.forEach((card, index) => {
      expect(card).toHaveAttribute('data-testid', `podcast-card-${mockPodcasts[index]!.id}`);
    });
  });

  it('should re-render when podcasts prop changes', () => {
    const { rerender } = renderWithRouter(<PodcastList podcasts={mockPodcasts} />);

    expect(screen.getAllByTestId(/podcast-card-/)).toHaveLength(3);

    const newPodcasts = mockPodcasts.slice(0, 1);
    rerender(
      <BrowserRouter>
        <PodcastList podcasts={newPodcasts} />
      </BrowserRouter>,
    );

    expect(screen.getAllByTestId(/podcast-card-/)).toHaveLength(1);
  });

  it('should transition from empty to populated list', () => {
    const { rerender } = renderWithRouter(<PodcastList podcasts={[]} />);

    expect(screen.getByText(/no podcasts found/i)).toBeInTheDocument();

    rerender(
      <BrowserRouter>
        <PodcastList podcasts={mockPodcasts} />
      </BrowserRouter>,
    );

    expect(screen.queryByText(/no podcasts found/i)).not.toBeInTheDocument();
    expect(screen.getAllByTestId(/podcast-card-/)).toHaveLength(3);
  });
});
