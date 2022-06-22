import retry from 'async-retry';
import type { RequestInfo, RequestInit , Request } from 'node-fetch';

import type { Fetch } from '../types.js';
import { FetchError } from '../types.js';

export interface RetryOptions {
  minTimeout?: number;
  retries?: number;
  factor?: number;
  onRetry?: (error: FetchError) => void;
}

export const withRetry =
  (fetch: Fetch, options?: RetryOptions): Fetch =>
  (url: RequestInfo, init?: RequestInit) => {
    const finalOptions = { minTimeout: 10, retries: 3, factor: 5, ...options };

    return retry(
      async (_bail, attempt) => {
        const isRetry = attempt < (finalOptions.retries ?? 3);
        const response = await fetch(url, init);

        if (response.status < 500 || response.status >= 600 || !isRetry) {
          return response;
        }

        const responseText = await response.text();
        const errorUrl = typeof url === 'string' ? url : (url as unknown as Request)?.url;

        throw new FetchError({
          message: responseText ?? 'fetch error',
          url: errorUrl,
          status: response.status,
          data: {
            attempt: String(attempt),
            status: String(response.status),
          },
        });
      },
      { ...finalOptions, onRetry: (err) => finalOptions.onRetry?.(err as FetchError) },
    );
  };
