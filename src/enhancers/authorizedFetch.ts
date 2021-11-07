import type { Request, RequestInit, Response } from 'node-fetch';

export type FetchAPI = (url: Request | string, init?: RequestInit) => Promise<Response>;

export const authorizedFetch =
  (getToken: () => Promise<string> | string, fetch: FetchAPI, init: RequestInit = {}) =>
  async (url: Request | string, innerInit: RequestInit = {}): Promise<Response> => {
    const innerFetch = fetch;
    const token = await getToken();

    return innerFetch(url, {
      ...innerInit,
      ...init,
      headers: {
        ...innerInit.headers,
        ...init.headers,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        Authorization: `Bearer ${token}`,
      },
    });
  };
