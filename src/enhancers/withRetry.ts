import retry from 'async-retry';
import type { RequestInfo, RequestInit } from 'node-fetch';
import { FetchError } from 'node-fetch';
import { Fetch } from '../types';

export type RetryOptions = {
    minTimeout?: number;
    retries?: number;
    factor?: number;
    onRetry?: (error: Error) => void;
};

export const withRetry =
    (fetch: Fetch, options: RetryOptions = { minTimeout: 10, retries: 3, factor: 5, onRetry: () => {} }): Fetch =>
    (url: RequestInfo, init?: RequestInit) => {
        return retry(
            async (_bail, attempt) => {
                const isRetry = attempt < (options.retries ?? 3);
                const response = await fetch(url, init);

                if (response.status < 500 || response.status >= 600 || !isRetry) {
                    return response;
                }

                const responseText = await response.text();

                throw new FetchError(responseText ?? 'fetch error', '');
            },
            { ...options, onRetry: (err) => options.onRetry?.(err) },
        );
    };
