import type { RequestInfo, RequestInit , Request } from 'node-fetch';

import type { Fetch } from '../types.js';
import { FetchError } from '../types.js';

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

      const errorUrl = typeof url === 'string' ? url : (url as unknown as Request)?.url;

      throw new FetchError({
        message: responseText ?? 'fetch error',
        url: errorUrl,
        status: response.status,
        data: responseJson,
      });
    }

    return response;
  };
