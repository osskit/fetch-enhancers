import type { Fetch } from '../types.js';

const headersToObject = (headers?: HeadersInit): Record<string, string> | undefined => {
  if (!headers) {
    return undefined;
  }
  if (headers instanceof Headers) {
    return Object.fromEntries(headers.entries());
  }
  if (Array.isArray(headers)) {
    return Object.fromEntries(headers);
  }
  if (typeof headers === 'object') {
    return { ...headers };
  }
  return undefined;
};

export const withHeaders =
  (fetch: Fetch, getHeaders: (headers?: HeadersInit) => HeadersInit | Promise<HeadersInit>): Fetch =>
  async (url, init) =>
    fetch(url, {
      ...init,
      headers: {
        ...headersToObject(init?.headers),
        ...headersToObject(await getHeaders(init?.headers)),
      },
    });
