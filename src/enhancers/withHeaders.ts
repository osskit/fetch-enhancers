import type { HeadersInit } from 'node-fetch';

import type { Fetch } from '../types.js';

export const withHeaders =
  (fetch: Fetch, getHeaders: (headers?: HeadersInit) => Record<string, string>): Fetch =>
  (url, init) =>
    fetch(url, {
      ...init,
      headers: {
        ...init?.headers,
        ...getHeaders(init?.headers),
      },
    });
