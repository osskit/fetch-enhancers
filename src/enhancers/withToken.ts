import type { Request, RequestInit, Response } from 'node-fetch';
import type { Fetch } from '../types';

export const withToken =
  (getToken: () => Promise<string> | string, fetch: Fetch) =>
  async (url: Request | string, innerInit: RequestInit = {}): Promise<Response> => {
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
