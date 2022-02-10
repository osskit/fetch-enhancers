import type { RequestInfo, RequestInit } from 'node-fetch';

import type { Fetch } from '../types';

export const withHeaders =
  (fetch: Fetch, getHeaders: () => Record<string, string>): Fetch =>
  (url: RequestInfo, init?: RequestInit) =>
    fetch(url, {
      ...init,
      headers: {
        ...init?.headers,
        ...getHeaders(),
      },
    });
