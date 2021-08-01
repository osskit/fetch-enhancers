import { FetchError, RequestInfo, RequestInit } from 'node-fetch';

import { Fetch } from '../types';

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
                Authorization: `Basic ${Buffer.from(`${username}:${password}`, 'binary').toString('base64')}`,
            },
        });

        if (!response.ok) {
            const responseText = await response.text();
            throw new FetchError(responseText ?? 'fetch error', '');
        }
        return response;
    };
