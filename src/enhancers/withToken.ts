import type { Fetch } from '../types.js';

export const withToken =
  (getToken: () => Promise<string> | string, fetch: Fetch): Fetch =>
  async (url, innerInit = {}) => {
    const innerFetch = fetch;
    const token = await getToken();

    return innerFetch(url, {
      ...innerInit,
      headers: {
        ...innerInit.headers,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        Authorization: `Bearer ${token}`,
      },
    });
  };
