import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as apiService from '@shared/services/api';
import type { Podcast } from '@entities/podcast';
import { mockPodcasts } from '@test/fixtures';

import { usePodcasts } from '../usePodcasts';

vi.mock('@shared/services/api', () => ({
  getTopPodcasts: vi.fn(),
}));

const mockSetGlobalLoading = vi.fn();
vi.mock('@app/providers', () => ({
  useLoading: () => ({
    isLoading: false,
    setIsLoading: mockSetGlobalLoading,
  }),
}));

describe('usePodcasts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch podcasts successfully', async () => {
    vi.mocked(apiService.getTopPodcasts).mockResolvedValue(mockPodcasts);
    const { result } = renderHook(() => usePodcasts());

    expect(result.current.isLoading).toBe(true);
    expect(result.current.podcasts).toEqual([]);
    expect(result.current.error).toBeNull();
    expect(mockSetGlobalLoading).toHaveBeenCalledWith(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.podcasts).toEqual(mockPodcasts);
    expect(result.current.error).toBeNull();
    expect(mockSetGlobalLoading).toHaveBeenCalledWith(false);
  });

  it('should handle API errors', async () => {
    const errorMessage = 'Network error';
    vi.mocked(apiService.getTopPodcasts).mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => usePodcasts());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.podcasts).toEqual([]);
    expect(result.current.error).toBe(errorMessage);
    expect(mockSetGlobalLoading).toHaveBeenCalledWith(false);
  });

  it('should handle non-Error exceptions', async () => {
    vi.mocked(apiService.getTopPodcasts).mockRejectedValue('String error');

    const { result } = renderHook(() => usePodcasts());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBe('Failed to fetch podcasts');
  });

  it('should log errors to console', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const error = new Error('Test error');
    vi.mocked(apiService.getTopPodcasts).mockRejectedValue(error);

    renderHook(() => usePodcasts());

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error fetching podcasts:', error);
    });

    consoleErrorSpy.mockRestore();
  });

  it('should set global loading state', async () => {
    vi.mocked(apiService.getTopPodcasts).mockResolvedValue(mockPodcasts);

    renderHook(() => usePodcasts());

    expect(mockSetGlobalLoading).toHaveBeenCalledWith(true);

    await waitFor(() => {
      expect(mockSetGlobalLoading).toHaveBeenCalledWith(false);
    });
  });

  it('should clear error state on mount', async () => {
    vi.mocked(apiService.getTopPodcasts).mockResolvedValue(mockPodcasts);
    const { result } = renderHook(() => usePodcasts());

    expect(result.current.error).toBeNull();

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(result.current.podcasts).toEqual(mockPodcasts);
    });
  });

  it('should handle empty podcasts array', async () => {
    vi.mocked(apiService.getTopPodcasts).mockResolvedValue([]);

    const { result } = renderHook(() => usePodcasts());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.podcasts).toEqual([]);
    expect(result.current.error).toBeNull();
  });

  it('should call API only once on mount', async () => {
    vi.mocked(apiService.getTopPodcasts).mockResolvedValue(mockPodcasts);

    renderHook(() => usePodcasts());

    await waitFor(() => {
      expect(apiService.getTopPodcasts).toHaveBeenCalledTimes(1);
    });
  });

  it('should maintain loading state throughout fetch', async () => {
    type ResolveFunction = (_value: Podcast[]) => void;
    let resolvePromise!: ResolveFunction;
    const pendingPromise = new Promise<Podcast[]>((resolve) => {
      resolvePromise = resolve;
    });

    vi.mocked(apiService.getTopPodcasts).mockReturnValue(pendingPromise);

    const { result } = renderHook(() => usePodcasts());

    expect(result.current.isLoading).toBe(true);
    expect(mockSetGlobalLoading).toHaveBeenCalledWith(true);

    resolvePromise(mockPodcasts);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(mockSetGlobalLoading).toHaveBeenCalledWith(false);
  });
});
