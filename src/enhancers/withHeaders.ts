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

const mergeHeaders = async (getHeaders: (headers?: HeadersInit) => HeadersInit | Promise<HeadersInit>, originalHeaders?: HeadersInit) => ({
  ...headersToObject(originalHeaders),
  ...headersToObject(await getHeaders(originalHeaders)),
});

export const withHeaders =
  (fetch: Fetch, getHeaders: (headers?: HeadersInit) => HeadersInit | Promise<HeadersInit>): Fetch =>
  async (url, init) => {
    if (url instanceof Request) {
      const mergedHeaders = await mergeHeaders(getHeaders, url.headers);
      const requestWithHeaders = new Request(url, {
        ...init,
        headers: mergedHeaders,
      });
      return fetch(requestWithHeaders);
    }

    return fetch(url, {
      ...init,
      headers: await mergeHeaders(getHeaders, init?.headers),
    });
  };
