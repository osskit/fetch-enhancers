import type { RequestInfo, RequestInit } from 'node-fetch';
import type { Fetch } from '../types';
import { FetchError } from '../types';

export const withThrow =
  (fetch: Fetch): Fetch =>
  async (url: RequestInfo, init?: RequestInit) => {
    const response = await fetch(url, init);

    if (!response.ok) {
      const responseText = await response.text();

      throw new FetchError(responseText ?? 'fetch error', JSON.stringify(url));
    }

    return response;
  };
