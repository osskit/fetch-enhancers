import type { RequestInfo, RequestInit } from 'node-fetch';

import type { Fetch } from '../types';
import { FetchError } from '../types';
import { Request } from 'node-fetch';

export interface BasicAuthenticationParams {
  username: string;
  password: string;
}

export const withBasicAuth =
  (fetch: Fetch, options: BasicAuthenticationParams): Fetch =>
  async (url: RequestInfo, init?: RequestInit) => {
    const { username, password } = options;

    const response = await fetch(url, {
      ...init,
      headers: {
        ...init?.headers,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        Authorization: `Basic ${Buffer.from(`${username}:${password}`, 'binary').toString('base64')}`,
      },
    });

    if (!response.ok) {
      const responseText = await response.text();
      const errorUrl = typeof url === 'string' ? url : (url as unknown as Request)?.url ?? (url as unknown as { href: string }).href;

      throw new FetchError({ message: responseText ?? 'fetch error', url: errorUrl, status: response.status });
    }

    return response;
  };
