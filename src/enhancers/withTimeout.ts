import AbortController from 'abort-controller';
import type { Request, RequestInfo, RequestInit } from 'node-fetch';

import type { Fetch } from '../types';
import { FetchError } from '../types';

export interface TimeoutOptions {
  requestTimeoutMs: number;
}

export const withTimeout = (fetch: Fetch, options: TimeoutOptions) => async (url: RequestInfo, init?: RequestInit) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    controller.abort();
  }, options.requestTimeoutMs);

  try {
    return await fetch(url, { signal: controller.signal, ...init });
  } catch (error) {
    const errorUrl = typeof url === 'string' ? url : (url as unknown as Request)?.url ?? (url as unknown as { href: string }).href;

    throw new FetchError({
      message: (error as Error).message ?? 'fetch error',
      url: errorUrl,
    });
  } finally {
    clearTimeout(timeoutId);
  }
};
