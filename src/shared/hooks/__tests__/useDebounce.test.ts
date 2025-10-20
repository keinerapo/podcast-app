import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

import { useDebounce } from '../useDebounce';

describe('useDebounce', () => {
  it('should return initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('initial', 500));

    expect(result.current).toBe('initial');
  });

  it('should debounce value changes', async () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 100), {
      initialProps: { value: 'initial' },
    });

    expect(result.current).toBe('initial');
    rerender({ value: 'updated' });
    expect(result.current).toBe('initial');

    await waitFor(
      () => {
        expect(result.current).toBe('updated');
      },
      { timeout: 200 },
    );
  });

  it('should cancel previous timeout on rapid value changes', async () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 100), {
      initialProps: { value: 'initial' },
    });

    rerender({ value: 'update1' });
    rerender({ value: 'update2' });
    rerender({ value: 'update3' });
    expect(result.current).toBe('initial');

    await waitFor(
      () => {
        expect(result.current).toBe('update3');
      },
      { timeout: 200 },
    );
  });

  it('should use custom delay', async () => {
    const customDelay = 150;
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, customDelay), {
      initialProps: { value: 'initial' },
    });

    rerender({ value: 'updated' });
    expect(result.current).toBe('initial');

    await waitFor(
      () => {
        expect(result.current).toBe('updated');
      },
      { timeout: 250 },
    );
  });

  it('should use default delay of 500ms when not provided', async () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value), {
      initialProps: { value: 'initial' },
    });

    rerender({ value: 'updated' });

    await waitFor(
      () => {
        expect(result.current).toBe('updated');
      },
      { timeout: 600 },
    );
  });

  it('should handle different types (numbers)', async () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 100), {
      initialProps: { value: 0 },
    });

    rerender({ value: 42 });

    await waitFor(
      () => {
        expect(result.current).toBe(42);
      },
      { timeout: 200 },
    );
  });

  it('should handle different types (objects)', async () => {
    interface TestObject {
      name: string;
      count: number;
    }

    const initialObj: TestObject = { name: 'test', count: 0 };
    const updatedObj: TestObject = { name: 'updated', count: 5 };

    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 100), {
      initialProps: { value: initialObj },
    });

    rerender({ value: updatedObj });

    await waitFor(
      () => {
        expect(result.current).toEqual(updatedObj);
      },
      { timeout: 200 },
    );
  });

  it('should handle different types (arrays)', async () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 100), {
      initialProps: { value: [1, 2, 3] },
    });

    rerender({ value: [4, 5, 6] });

    await waitFor(
      () => {
        expect(result.current).toEqual([4, 5, 6]);
      },
      { timeout: 200 },
    );
  });

  it('should update delay dynamically', async () => {
    const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
      initialProps: { value: 'initial', delay: 200 },
    });

    rerender({ value: 'updated', delay: 100 });

    await waitFor(
      () => {
        expect(result.current).toBe('updated');
      },
      { timeout: 200 },
    );
  });

  it('should cleanup timeout on unmount', () => {
    const clearTimeoutSpy = vi.spyOn(globalThis, 'clearTimeout');

    const { unmount } = renderHook(() => useDebounce('test', 500));

    unmount();

    expect(clearTimeoutSpy).toHaveBeenCalled();
  });

  it('should handle null and undefined values', async () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 100), {
      initialProps: { value: 'initial' as string | null | undefined },
    });

    rerender({ value: null });

    await waitFor(
      () => {
        expect(result.current).toBeNull();
      },
      { timeout: 200 },
    );

    rerender({ value: undefined });

    await waitFor(
      () => {
        expect(result.current).toBeUndefined();
      },
      { timeout: 200 },
    );
  });
});
