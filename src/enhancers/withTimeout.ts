import type { Fetch } from '../types.js';
import { FetchError } from '../fetchError.js';

export interface TimeoutOptions {
  requestTimeoutMs: number;
}

export const withTimeout =
  (fetch: Fetch, options: TimeoutOptions): Fetch =>
  async (url, init) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, options.requestTimeoutMs);

    try {
      return await fetch(url, { signal: controller.signal, ...init });
    } catch (error) {
      const errorUrl = typeof url === 'string' ? url : url?.url;

      throw new FetchError({
        message: (error as Error).message ?? 'fetch error',
        url: errorUrl,
        status: 504,
        data: { timeoutOptions: options },
      });
    } finally {
      clearTimeout(timeoutId);
    }
  };
