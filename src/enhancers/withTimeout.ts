import AbortController from 'abort-controller';

import type { Fetch } from '../types.js';
import { FetchError } from '../types.js';

export interface TimeoutOptions {
  requestTimeoutMs: number;
}

export const withTimeout = (fetch: Fetch, options: TimeoutOptions): Fetch => async (url, init) => {
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
    });
  } finally {
    clearTimeout(timeoutId);
  }
};
