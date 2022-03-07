import type { HeadersInit, RequestInfo, RequestInit } from 'node-fetch';

import type { Fetch } from '../types';

export const withHeaders =
  (fetch: Fetch, getHeaders: (headers?: HeadersInit) => Record<string, string>): Fetch =>
  (url: RequestInfo, init?: RequestInit) =>
    fetch(url, {
      ...init,
      headers: {
        ...init?.headers,
        ...getHeaders(init?.headers),
      },
    });
