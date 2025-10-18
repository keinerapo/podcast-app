import { CACHE_CONFIG } from '@shared/constants/api.constants';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

/**
 * Cache Service using LocalStorage
 * Implements Cache-Aside pattern with TTL validation
 */
class CacheService {
  private readonly ttl: number;

  constructor(ttl: number = CACHE_CONFIG.TTL) {
    this.ttl = ttl;
  }

  /**
   * Get item from cache
   * @param key - Cache key
   * @returns Cached data or null if expired/not found
   */
  get<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key);
      if (!item) {
        return null;
      }

      const entry: CacheEntry<T> = JSON.parse(item);
      const now = Date.now();

      if (now - entry.timestamp > this.ttl) {
        this.delete(key);
        return null;
      }

      return entry.data;
    } catch (error) {
      console.error(`[CacheService] Error reading cache key "${key}":`, error);
      return null;
    }
  }

  /**
   * Set item in cache with current timestamp
   * @param key - Cache key
   * @param data - Data to cache
   */
  set<T>(key: string, data: T): void {
    try {
      const entry: CacheEntry<T> = {
        data,
        timestamp: Date.now(),
      };

      localStorage.setItem(key, JSON.stringify(entry));
    } catch (error) {
      console.error(`[CacheService] Error setting cache key "${key}":`, error);
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        this.clear();
      }
    }
  }

  /**
   * Delete specific cache entry
   * @param key - Cache key to delete
   */
  delete(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`[CacheService] Error deleting cache key "${key}":`, error);
    }
  }

  /**
   * Clear all cache entries
   * Useful when quota is exceeded or for manual cache invalidation
   */
  clear(): void {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('[CacheService] Error clearing cache:', error);
    }
  }

  /**
   * Check if a cache entry exists and is valid (not expired)
   * @param key - Cache key to check
   * @returns true if entry exists and is valid
   */
  has(key: string): boolean {
    return this.get(key) !== null;
  }

  /**
   * Get remaining TTL for a cache entry
   * @param key - Cache key
   * @returns Remaining milliseconds or 0 if expired/not found
   */
  getRemainingTTL(key: string): number {
    try {
      const item = localStorage.getItem(key);
      if (!item) {
        return 0;
      }

      const entry: CacheEntry<unknown> = JSON.parse(item);
      const elapsed = Date.now() - entry.timestamp;
      const remaining = this.ttl - elapsed;

      return remaining > 0 ? remaining : 0;
    } catch (error) {
      console.error(`[CacheService] Error checking TTL for key "${key}":`, error);
      return 0;
    }
  }
}

export const cacheService = new CacheService();
