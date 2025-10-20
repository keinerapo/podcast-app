import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { usePodcastDetail } from '../usePodcastDetail';
import * as apiService from '@shared/services/api';
import type { PodcastDetail } from '@shared/types/podcast.types';

vi.mock('@shared/services/api', () => ({
  getPodcastDetail: vi.fn(),
}));

const mockSetGlobalLoading = vi.fn();
vi.mock('@app/providers', () => ({
  useLoading: () => ({
    isLoading: false,
    setIsLoading: mockSetGlobalLoading,
  }),
}));

describe('usePodcastDetail', () => {
  const mockPodcastDetail: PodcastDetail = {
    id: '123',
    name: 'Test Podcast',
    author: 'Test Author',
    image: 'https://example.com/image.jpg',
    summary: 'Test summary',
    genre: 'Technology',
    episodes: [
      {
        id: 'ep1',
        title: 'Episode 1',
        description: 'Description 1',
        publishedDate: '2024-01-01',
        duration: 3600000,
        audioUrl: 'https://example.com/audio1.mp3',
      },
      {
        id: 'ep2',
        title: 'Episode 2',
        description: 'Description 2',
        publishedDate: '2024-01-02',
        duration: 2400000,
        audioUrl: 'https://example.com/audio2.mp3',
      },
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch podcast detail successfully', async () => {
    vi.mocked(apiService.getPodcastDetail).mockResolvedValue(mockPodcastDetail);
    const { result } = renderHook(() => usePodcastDetail('123'));

    expect(result.current.isLoading).toBe(true);
    expect(result.current.podcastDetail).toBeNull();
    expect(result.current.error).toBeNull();
    expect(mockSetGlobalLoading).toHaveBeenCalledWith(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.podcastDetail).toEqual(mockPodcastDetail);
    expect(result.current.error).toBeNull();
    expect(mockSetGlobalLoading).toHaveBeenCalledWith(false);
  });

  it('should handle API errors', async () => {
    const errorMessage = 'Failed to load podcast';
    vi.mocked(apiService.getPodcastDetail).mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => usePodcastDetail('123'));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.podcastDetail).toBeNull();
    expect(result.current.error).toBe(errorMessage);
    expect(mockSetGlobalLoading).toHaveBeenCalledWith(false);
  });

  it('should handle non-Error exceptions', async () => {
    vi.mocked(apiService.getPodcastDetail).mockRejectedValue('String error');

    const { result } = renderHook(() => usePodcastDetail('123'));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBe('Failed to fetch podcast details');
  });

  it('should log errors to console', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const error = new Error('Test error');
    vi.mocked(apiService.getPodcastDetail).mockRejectedValue(error);

    renderHook(() => usePodcastDetail('123'));

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error fetching podcast detail:', error);
    });

    consoleErrorSpy.mockRestore();
  });

  it('should refetch when podcastId changes', async () => {
    vi.mocked(apiService.getPodcastDetail).mockResolvedValue(mockPodcastDetail);

    const { rerender } = renderHook(
      ({ id }) => usePodcastDetail(id),
      { initialProps: { id: '123' } }
    );

    await waitFor(() => {
      expect(apiService.getPodcastDetail).toHaveBeenCalledWith('123');
    });

    const newMockDetail = { ...mockPodcastDetail, id: '456', name: 'Different Podcast' };
    vi.mocked(apiService.getPodcastDetail).mockResolvedValue(newMockDetail);

    rerender({ id: '456' });

    await waitFor(() => {
      expect(apiService.getPodcastDetail).toHaveBeenCalledWith('456');
      expect(apiService.getPodcastDetail).toHaveBeenCalledTimes(2);
    });
  });

  it('should cancel fetch if component unmounts', async () => {
    let resolvePromise: (value: PodcastDetail) => void;
    const pendingPromise = new Promise<PodcastDetail>((resolve) => {
      resolvePromise = resolve;
    });

    vi.mocked(apiService.getPodcastDetail).mockReturnValue(pendingPromise);

    const { result, unmount } = renderHook(() => usePodcastDetail('123'));

    expect(result.current.isLoading).toBe(true);

    unmount();

    resolvePromise!(mockPodcastDetail);

    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(result.current.podcastDetail).toBeNull();
  });

  it('should not update state if cancelled during fetch', async () => {
    let resolvePromise: (value: PodcastDetail) => void;
    const pendingPromise = new Promise<PodcastDetail>((resolve) => {
      resolvePromise = resolve;
    });

    vi.mocked(apiService.getPodcastDetail).mockReturnValue(pendingPromise);

    const { result, rerender } = renderHook(
      ({ id }) => usePodcastDetail(id),
      { initialProps: { id: '123' } }
    );

    expect(result.current.isLoading).toBe(true);

    rerender({ id: '456' });

    resolvePromise!(mockPodcastDetail);

    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(apiService.getPodcastDetail).toHaveBeenCalledWith('456');
  });

  it('should handle error without updating if cancelled', async () => {
    let rejectPromise: (error: Error) => void;
    const pendingPromise = new Promise<PodcastDetail>((_, reject) => {
      rejectPromise = reject;
    });

    vi.mocked(apiService.getPodcastDetail).mockReturnValue(pendingPromise);

    const { result, unmount } = renderHook(() => usePodcastDetail('123'));

    expect(result.current.isLoading).toBe(true);

    unmount();

    rejectPromise!(new Error('Test error'));

    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(result.current.error).toBeNull();
  });

  it('should set global loading state', async () => {
    vi.mocked(apiService.getPodcastDetail).mockResolvedValue(mockPodcastDetail);

    renderHook(() => usePodcastDetail('123'));

    expect(mockSetGlobalLoading).toHaveBeenCalledWith(true);

    await waitFor(() => {
      expect(mockSetGlobalLoading).toHaveBeenCalledWith(false);
    });
  });

  it('should clear error state on mount', async () => {
    vi.mocked(apiService.getPodcastDetail).mockResolvedValue(mockPodcastDetail);
    const { result } = renderHook(() => usePodcastDetail('123'));

    expect(result.current.error).toBeNull();

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(result.current.podcastDetail).toEqual(mockPodcastDetail);
    });
  });

  it('should maintain loading state throughout fetch', async () => {
    let resolvePromise: (value: PodcastDetail) => void;
    const pendingPromise = new Promise<PodcastDetail>((resolve) => {
      resolvePromise = resolve;
    });

    vi.mocked(apiService.getPodcastDetail).mockReturnValue(pendingPromise);

    const { result } = renderHook(() => usePodcastDetail('123'));

    expect(result.current.isLoading).toBe(true);
    expect(mockSetGlobalLoading).toHaveBeenCalledWith(true);

    resolvePromise!(mockPodcastDetail);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(mockSetGlobalLoading).toHaveBeenCalledWith(false);
  });
});
