import type { RequestInfo, RequestInit } from 'node-fetch';

import type { Fetch } from '../types';
import { FetchError } from '../types';

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

            throw new FetchError(responseText ?? 'fetch error', url.toString());
        }

        return response;
    };
