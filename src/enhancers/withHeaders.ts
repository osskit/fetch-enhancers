import type { HeadersInit, RequestInfo, RequestInit } from 'node-fetch';

import type { Fetch } from '../types.js';

export const withHeaders =
  (fetch: Fetch, getHeaders: (headers?: HeadersInit | undefined) => Record<string, string>): Fetch =>
  (url: RequestInfo, init?: RequestInit) =>
    fetch(url, {
      ...init,
      headers: {
        ...init?.headers,
        ...getHeaders(init?.headers),
      },
    });
