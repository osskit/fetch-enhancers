import type { Fetch } from '../types.js';
import { FetchError } from '../fetchError.js';

export interface BasicAuthenticationParams {
  username: string;
  password: string;
}

export const withBasicAuth =
  (fetch: Fetch, { username, password }: BasicAuthenticationParams): Fetch =>
  async (url, init) => {
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
      const errorUrl = typeof url === 'string' ? url : url instanceof URL ? url.toString() : url?.url;

      throw new FetchError({ message: responseText ?? 'fetch error', url: errorUrl, status: response.status });
    }

    return response;
  };
