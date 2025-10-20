import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import { useLocalStorage } from '../useLocalStorage';

describe('useLocalStorage', () => {
  const TEST_KEY = 'test-key';
  const INITIAL_VALUE = 'initial';

  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should return initial value when localStorage is empty', () => {
    const { result } = renderHook(() => useLocalStorage(TEST_KEY, INITIAL_VALUE));

    expect(result.current[0]).toBe(INITIAL_VALUE);
  });

  it('should return stored value from localStorage if exists', () => {
    const storedValue = 'stored-value';
    localStorage.setItem(TEST_KEY, JSON.stringify(storedValue));

    const { result } = renderHook(() => useLocalStorage(TEST_KEY, INITIAL_VALUE));

    expect(result.current[0]).toBe(storedValue);
  });

  it('should update localStorage when setValue is called', () => {
    const { result } = renderHook(() => useLocalStorage(TEST_KEY, INITIAL_VALUE));
    const newValue = 'new-value';

    act(() => {
      result.current[1](newValue);
    });

    expect(result.current[0]).toBe(newValue);
    expect(localStorage.getItem(TEST_KEY)).toBe(JSON.stringify(newValue));
  });

  it('should handle function updater like useState', () => {
    const { result } = renderHook(() => useLocalStorage<number>(TEST_KEY, 0));

    act(() => {
      result.current[1]((prev) => prev + 1);
    });

    expect(result.current[0]).toBe(1);
    expect(localStorage.getItem(TEST_KEY)).toBe('1');
  });

  it('should handle complex objects', () => {
    interface TestObject {
      name: string;
      age: number;
    }

    const initialObject: TestObject = { name: 'John', age: 30 };
    const { result } = renderHook(() => useLocalStorage(TEST_KEY, initialObject));

    const newObject: TestObject = { name: 'Jane', age: 25 };

    act(() => {
      result.current[1](newObject);
    });

    expect(result.current[0]).toEqual(newObject);
    expect(JSON.parse(localStorage.getItem(TEST_KEY)!)).toEqual(newObject);
  });

  it('should return initial value when localStorage contains invalid JSON', () => {
    localStorage.setItem(TEST_KEY, 'invalid-json{');
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const { result } = renderHook(() => useLocalStorage(TEST_KEY, INITIAL_VALUE));

    expect(result.current[0]).toBe(INITIAL_VALUE);
    expect(consoleErrorSpy).toHaveBeenCalled();

    consoleErrorSpy.mockRestore();
  });

  it('should handle storage events from other tabs/windows', () => {
    const { result } = renderHook(() => useLocalStorage(TEST_KEY, INITIAL_VALUE));
    const newValue = 'value-from-other-tab';

    act(() => {
      const storageEvent = new StorageEvent('storage', {
        key: TEST_KEY,
        newValue: JSON.stringify(newValue),
        oldValue: JSON.stringify(INITIAL_VALUE),
        storageArea: localStorage,
      });
      window.dispatchEvent(storageEvent);
    });

    expect(result.current[0]).toBe(newValue);
  });

  it('should ignore storage events for different keys', () => {
    const { result } = renderHook(() => useLocalStorage(TEST_KEY, INITIAL_VALUE));

    act(() => {
      const storageEvent = new StorageEvent('storage', {
        key: 'different-key',
        newValue: JSON.stringify('different-value'),
        storageArea: localStorage,
      });
      window.dispatchEvent(storageEvent);
    });

    expect(result.current[0]).toBe(INITIAL_VALUE);
  });

  it('should handle storage events with null newValue', () => {
    const { result } = renderHook(() => useLocalStorage(TEST_KEY, INITIAL_VALUE));

    act(() => {
      const storageEvent = new StorageEvent('storage', {
        key: TEST_KEY,
        newValue: null,
        storageArea: localStorage,
      });
      window.dispatchEvent(storageEvent);
    });

    expect(result.current[0]).toBe(INITIAL_VALUE);
  });

  it('should handle errors when setting localStorage', () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const originalSetItem = Storage.prototype.setItem;
    Storage.prototype.setItem = vi.fn(() => {
      throw new Error('QuotaExceededError');
    });

    const { result } = renderHook(() => useLocalStorage(TEST_KEY, INITIAL_VALUE));

    act(() => {
      result.current[1]('new-value');
    });

    expect(consoleErrorSpy).toHaveBeenCalled();

    Storage.prototype.setItem = originalSetItem;
    consoleErrorSpy.mockRestore();
  });

  it('should cleanup event listener on unmount', () => {
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');

    const { unmount } = renderHook(() => useLocalStorage(TEST_KEY, INITIAL_VALUE));

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith('storage', expect.any(Function));

    removeEventListenerSpy.mockRestore();
  });
});
