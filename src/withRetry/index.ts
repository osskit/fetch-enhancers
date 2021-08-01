import retry from 'async-retry';
import cloneDeep from 'lodash.clonedeep';
import { Response } from 'node-fetch';

import { FetchEnhancer } from '../types';
import { FetchTimeoutError } from '..';

import { FetchRetryError } from './errors';

const MIN_TIMEOUT = 10;
const MAX_RETRIES = 3;
const FACTOR = 5;

export type RetryOptions = {
    retry?: {
        minTimeout?: number;
        retries?: number;
        factor?: number;
        retryOnTimeout?: boolean;
        onRetry?: (error: FetchRetryError) => void;
    };
};

export const withRetry: FetchEnhancer<RetryOptions> =
    (fetch, globalOptions = {}) =>
    (url, init = {}) => {
        const retryOpts = {
            ...{ minTimeout: MIN_TIMEOUT, retries: MAX_RETRIES, factor: FACTOR },
            ...(globalOptions.retry || {}),
            ...(init.enhancers ? init.enhancers.retry : {}),
        };

        return retry(
            async (bail, attempt) => {
                const isRetry = attempt < retryOpts.retries;
                const urlString = typeof url === 'string' ? url : url.url;
                let res: Response;
                try {
                    res = await fetch(url, init);
                } catch (err) {
                    if (retryOpts.retryOnTimeout && err instanceof FetchTimeoutError) {
                        throw new FetchRetryError(
                            'Got a timeout',
                            urlString,
                            attempt,
                            cloneDeep(init),
                            undefined,
                            err.status,
                        );
                    }

                    bail(err);
                    return new Response();
                }

                if (res.status < 500 || res.status >= 600 || !isRetry) {
                    return res;
                }

                const response = res.clone();
                throw new FetchRetryError(
                    'Got failure status code',
                    urlString,
                    attempt,
                    cloneDeep(init),
                    undefined,
                    response.status,
                    response.statusText,
                    await response.text(),
                );
            },
            { ...retryOpts, onRetry: (err) => retryOpts.onRetry && retryOpts.onRetry(err as FetchRetryError) },
        );
    };

export * from './errors';
