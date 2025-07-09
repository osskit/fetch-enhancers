import type { Fetch } from '../types.js';
import { withHeaders } from './withHeaders.js';

export const withToken = (getToken: () => Promise<string> | string, fetch: Fetch): Fetch =>
  withHeaders(fetch, async () => ({
    // eslint-disable-next-line @typescript-eslint/naming-convention
    Authorization: `Bearer ${await getToken()}`,
  }));
