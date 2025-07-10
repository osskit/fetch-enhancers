import type { Fetch } from '../types.js';
import { withHeaders } from './withHeaders.js';

export interface BasicAuthenticationParams {
  username: string;
  password: string;
}

export const withBasicAuth = (fetch: Fetch, { username, password }: BasicAuthenticationParams): Fetch => {
  const basicAuth = `Basic ${Buffer.from(`${username}:${password}`, 'binary').toString('base64')}`;

  return withHeaders(fetch, () => ({
    // eslint-disable-next-line @typescript-eslint/naming-convention
    Authorization: basicAuth,
  }));
};
