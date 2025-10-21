import { screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import type { Podcast } from '@shared/types/podcast.types';
import { renderWithRouter } from '@test/utils';

import { PodcastCard } from '../PodcastCard';

describe('PodcastCard', () => {
  const mockPodcast: Podcast = {
    id: '123',
    name: 'Test Podcast',
    author: 'Test Author',
    image: 'https://example.com/image.jpg',
    summary: 'Test summary',
  };

  it('should render podcast name', () => {
    renderWithRouter(<PodcastCard podcast={mockPodcast} />);

    const title = screen.getByRole('heading', { name: mockPodcast.name });
    expect(title).toBeInTheDocument();
  });

  it('should render podcast author with label', () => {
    renderWithRouter(<PodcastCard podcast={mockPodcast} />);

    const author = screen.getByText(`Author: ${mockPodcast.author}`);
    expect(author).toBeInTheDocument();
  });

  it('should render podcast image with correct attributes', () => {
    renderWithRouter(<PodcastCard podcast={mockPodcast} />);

    const image = screen.getByRole('img');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', mockPodcast.image);
    expect(image).toHaveAttribute('alt', `${mockPodcast.name} cover`);
    expect(image).toHaveAttribute('loading', 'lazy');
  });

  it('should render as a link to podcast detail page', () => {
    renderWithRouter(<PodcastCard podcast={mockPodcast} />);

    const link = screen.getByRole('link');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', `/podcast/${mockPodcast.id}`);
  });

  it('should have semantic HTML structure with article element', () => {
    const { container } = renderWithRouter(<PodcastCard podcast={mockPodcast} />);

    const article = container.querySelector('article');
    expect(article).toBeInTheDocument();
  });

  it('should render heading at level 3', () => {
    renderWithRouter(<PodcastCard podcast={mockPodcast} />);

    const heading = screen.getByRole('heading', { level: 3 });
    expect(heading).toHaveTextContent(mockPodcast.name);
  });

  it('should handle long podcast names', () => {
    const longNamePodcast: Podcast = {
      ...mockPodcast,
      name: 'This is a very long podcast name that might need to be truncated or handled specially in the UI',
    };

    renderWithRouter(<PodcastCard podcast={longNamePodcast} />);

    const title = screen.getByRole('heading', { name: longNamePodcast.name });
    expect(title).toBeInTheDocument();
  });

  it('should handle long author names', () => {
    const longAuthorPodcast: Podcast = {
      ...mockPodcast,
      author: 'This is a very long author name that might need special handling',
    };

    renderWithRouter(<PodcastCard podcast={longAuthorPodcast} />);

    const author = screen.getByText(`Author: ${longAuthorPodcast.author}`);
    expect(author).toBeInTheDocument();
  });
});
