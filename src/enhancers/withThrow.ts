import type { Fetch } from '../types.js';
import { FetchError } from '../fetchError.js';

export const withThrow =
  (fetch: Fetch): Fetch =>
  async (url, init) => {
    const response = await fetch(url, init);

    if (!response.ok) {
      const responseText = await response.text();
      let responseJson;

      try {
        responseJson = JSON.parse(responseText);
      } catch {
        // do nothing
      }

      const errorUrl = typeof url === 'string' ? url : url instanceof URL ? url.toString() : url?.url;

      throw new FetchError({
        message: responseText ?? 'fetch error',
        url: errorUrl,
        status: response.status,
        data: responseJson,
      });
    }

    return response;
  };
