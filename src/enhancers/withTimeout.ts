import type { Fetch } from '../types.js';
import { FetchError } from '../fetchError.js';

export interface TimeoutOptions {
  requestTimeoutMs: number;
}

export const withTimeout =
  (fetch: Fetch, options: TimeoutOptions): Fetch =>
  async (url, init) => {
    try {
      return await fetch(url, {
        signal: AbortSignal.any([AbortSignal.timeout(options.requestTimeoutMs), ...(init?.signal ? [init.signal] : [])]),
        ...init,
      });
    } catch (error) {
      const errorUrl = typeof url === 'string' ? url : url instanceof URL ? url.toString() : url?.url;
      if (error instanceof Error) {
        switch (error.name) {
          case 'AbortError': {
            throw new FetchError({
              message: 'abort requested',
              url: errorUrl,
              data: { timeoutOptions: options },
            });
          }
          case 'TimeoutError': {
            throw new FetchError({
              message: 'request timeout',
              url: errorUrl,
              data: { timeoutOptions: options },
            });
          }
          default: {
            throw error;
          }
        }
      } 
      throw error;
    }
  };
