import type { Fetch } from '../types.js';

export const withHeaders =
  (fetch: Fetch, getHeaders: (headers?: HeadersInit) => HeadersInit): Fetch =>
  (url, init) =>
    fetch(url, {
      ...init,
      headers: {
        ...init?.headers,
        ...getHeaders(init?.headers),
      },
    });
