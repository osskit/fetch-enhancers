import type { Fetch } from '../types.js';
import { FetchError } from '../types.js';

export interface BasicAuthenticationParams {
  username: string;
  password: string;
}

export const withBasicAuth =
  (fetch: Fetch, options: BasicAuthenticationParams): Fetch =>
  async (url, init) => {
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
      const errorUrl = typeof url === 'string' ? url : url?.url;

      throw new FetchError({ message: responseText ?? 'fetch error', url: errorUrl, status: response.status });
    }

    return response;
  };
