import AbortController from 'abort-controller';
import { RequestInfo, RequestInit } from 'node-fetch';

import { Fetch, FetchError} from '../types';

export type TimeoutOptions = {
    requestTimeoutMs: number;
};

export const withTimeout = (fetch: Fetch, options: TimeoutOptions) => async (url: RequestInfo, init?: RequestInit) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), options.requestTimeoutMs);

    try {
        return await fetch(url, Object.assign({ signal: controller.signal }, init));
    } catch (error) {
        throw new FetchError((error as any).message ?? 'fetch error', url.toString());
    } finally {
        clearTimeout(timeoutId);
    }
};
