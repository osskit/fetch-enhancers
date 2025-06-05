import type { Fetch } from '../types.js';
import { FetchError } from '../fetchError.js';

export interface TimeoutOptions {
  requestTimeoutMs: number;
}

export const withTimeout =
  (fetch: Fetch, options: TimeoutOptions): Fetch =>
  async (url, init) => {
    try {
      const timeoutSignal = AbortSignal.timeout(options.requestTimeoutMs);
      const signal = init?.signal ? AbortSignal.any([timeoutSignal, init.signal]) : timeoutSignal;
      
      return await fetch(url, {
        signal,
        ...init,
      });
    } catch (error) {
      if (!(error instanceof Error)) {
        throw error;
      }

      const errorUrl = typeof url === 'string' ? url : url instanceof URL ? url.toString() : url?.url;

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
  };
