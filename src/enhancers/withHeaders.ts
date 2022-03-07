import type { RequestInfo, RequestInit } from 'node-fetch';

import type { Fetch } from '../types';
import { Headers } from 'node-fetch';

export const withHeaders =
  (fetch: Fetch, getHeaders: (headers?: Headers) => Record<string, string>): Fetch =>
  (url: RequestInfo, init?: RequestInit) =>
    fetch(url, {
      ...init,
      headers: {
        ...init?.headers,
        ...getHeaders(new Headers(init?.headers)),
      },
    });
