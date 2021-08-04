import { Headers, RequestInfo, RequestInit } from 'node-fetch';

import { Fetch } from '../types';

export const withHeaders =
    (fetch: Fetch, headers: Headers): Fetch =>
    (url: RequestInfo, init?: RequestInit) =>
        fetch(url, {
            ...init,
            headers: {
                ...init?.headers,
                ...headers,
            },
        });
