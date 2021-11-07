import AbortController from 'abort-controller';
import type { RequestInfo, RequestInit } from 'node-fetch';

import type { Fetch } from '../types';
import { FetchError } from '../types';

export interface TimeoutOptions {
    requestTimeoutMs: number;
}

export const withTimeout = (fetch: Fetch, options: TimeoutOptions) => async (url: RequestInfo, init?: RequestInit) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
        controller.abort();
    }, options.requestTimeoutMs);

    try {
        return await fetch(url, { signal: controller.signal, ...init });
    } catch (error) {
        throw new FetchError((error as Error).message ?? 'fetch error', JSON.stringify(url));
    } finally {
        clearTimeout(timeoutId);
    }
};
