import type { RequestInfo, RequestInit } from 'node-fetch';
import type { Fetch } from '../types';
import { FetchError } from '../types';

export const withThrow =
  (fetch: Fetch): Fetch =>
  async (url: RequestInfo, init?: RequestInit) => {
    const response = await fetch(url, init);

    if (!response.ok) {
      const responseText = await response.text();
      let responseJson;

      try {
        responseJson = JSON.parse(responseText);
      } catch {
        // do nothing
      }

      throw new FetchError({
        message: responseText ?? 'fetch error',
        url: JSON.stringify(url),
        status: response.status,
        data: responseJson,
      });
    }

    return response;
  };
