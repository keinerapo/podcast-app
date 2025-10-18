import { ALL_ORIGINS_PROXY } from '@shared/constants/api.constants';

interface AllOriginsResponse {
  contents: string;
  status: {
    url: string;
    content_type: string;
    http_code: number;
    response_time: number;
  };
}

/**
 * Custom error for proxy-related failures
 */
export class ProxyError extends Error {
  public readonly statusCode?: number;
  public readonly originalUrl?: string;

  constructor(message: string, statusCode?: number, originalUrl?: string) {
    super(message);
    this.name = 'ProxyError';
    this.statusCode = statusCode;
    this.originalUrl = originalUrl;
  }
}

/**
 * Fetch data through AllOrigins proxy to bypass CORS restrictions
 *
 * @param url - The original URL to fetch from
 * @returns Parsed JSON response from the original URL
 * @throws {ProxyError} When the proxy request fails or returns an error
 */
export async function fetchThroughProxy<T = unknown>(url: string): Promise<T> {
  const encodedUrl = encodeURIComponent(url);
  const proxyUrl = `${ALL_ORIGINS_PROXY}${encodedUrl}`;

  try {
    const response = await fetch(proxyUrl);

    if (!response.ok) {
      throw new ProxyError(
        `Proxy request failed with status ${response.status}`,
        response.status,
        url,
      );
    }

    const proxyData: AllOriginsResponse = await response.json();

    if (proxyData.status.http_code >= 400) {
      throw new ProxyError(
        `Original request failed with status ${proxyData.status.http_code}`,
        proxyData.status.http_code,
        url,
      );
    }

    const originalData: T = JSON.parse(proxyData.contents);

    return originalData;
  } catch (error) {
    if (error instanceof ProxyError) {
      throw error;
    }

    if (error instanceof Error) {
      throw new ProxyError(`Failed to fetch through proxy: ${error.message}`, undefined, url);
    }

    throw new ProxyError('Unknown error occurred while using proxy', undefined, url);
  }
}
