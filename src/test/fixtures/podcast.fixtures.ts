import type { Podcast, PodcastDetail } from '@entities/podcast';
import type { Episode } from '@entities/episode';

export const mockEpisodes: Episode[] = [
  {
    id: 'ep1',
    title: 'Episode 1: Getting Started',
    description: 'This is the first episode where we introduce the podcast.',
    publishedDate: '2024-01-01',
    duration: 3600000,
    audioUrl: 'https://example.com/audio/ep1.mp3',
  },
  {
    id: 'ep2',
    title: 'Episode 2: Advanced Topics',
    description: 'We dive deeper into advanced topics.',
    publishedDate: '2024-01-08',
    duration: 4200000,
    audioUrl: 'https://example.com/audio/ep2.mp3',
  },
  {
    id: 'ep3',
    title: 'Episode 3',
    description: 'Description 3',
    publishedDate: '2024-01-03',
    duration: 1800000,
    audioUrl: 'https://example.com/audio3.mp3',
  },
];

export const mockPodcasts: Podcast[] = [
  {
    id: '1',
    name: 'The Joe Rogan Experience',
    author: 'Joe Rogan',
    image: 'https://example.com/joe.jpg',
    summary: 'Long form conversations',
  },
  {
    id: '2',
    name: 'Crime Junkie',
    author: 'audiochuck',
    image: 'https://example.com/crime.jpg',
    summary: 'True crime podcast',
  },
  {
    id: '3',
    name: 'The Daily',
    author: 'The New York Times',
    image: 'https://example.com/daily.jpg',
    summary: 'News podcast',
  },
];

export const mockPodcastDetail: PodcastDetail = {
  id: 'podcast123',
  name: 'Test Podcast',
  author: 'Test Author',
  image: 'https://example.com/podcast.jpg',
  summary: 'A great test podcast',
  genre: 'Technology',
  episodes: mockEpisodes,
};

/**
 * Factory function to create a mock podcast with custom properties
 * @param overrides - Partial podcast properties to override defaults
 * @returns A new mock podcast object
 */
export const createMockPodcast = (overrides?: Partial<Podcast>): Podcast => ({
  id: '1',
  name: 'Test Podcast',
  author: 'Test Author',
  image: 'https://example.com/image.jpg',
  summary: 'Test summary',
  ...overrides,
});

/**
 * Factory function to create a mock podcast detail with custom properties
 * @param overrides - Partial podcast detail properties to override defaults
 * @returns A new mock podcast detail object
 */
export const createMockPodcastDetail = (overrides?: Partial<PodcastDetail>): PodcastDetail => ({
  id: '123',
  name: 'Test Podcast',
  author: 'Test Author',
  image: 'https://example.com/image.jpg',
  summary: 'Test summary',
  genre: 'Technology',
  episodes: mockEpisodes,
  ...overrides,
});

/**
 * Factory function to create a mock episode with custom properties
 * @param overrides - Partial episode properties to override defaults
 * @returns A new mock episode object
 */
export const createMockEpisode = (overrides?: Partial<Episode>): Episode => ({
  id: 'ep1',
  title: 'Test Episode',
  description: 'Test description',
  publishedDate: '2024-01-01',
  duration: 3600000,
  audioUrl: 'https://example.com/audio.mp3',
  ...overrides,
});
