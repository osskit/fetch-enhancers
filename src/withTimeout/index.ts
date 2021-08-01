import cloneDeep from 'lodash.clonedeep';
import AbortController from 'abort-controller';
import { RequestInit } from 'node-fetch';

import { FetchEnhancer } from '../types';

import { FetchTimeoutError } from './errors';

export type TimeoutOptions = {
    timeout?: {
        requestTimeoutMs?: number;
    };
};

export const withTimeout: FetchEnhancer<TimeoutOptions> =
    (fetch, globalOptions = {}) =>
    async (url, init = {}) => {
        const timeoutOptions = {
            ...(globalOptions.timeout || {}),
            ...(init.enhancers ? init.enhancers.timeout : {}),
        };

        if (!timeoutOptions.requestTimeoutMs) return fetch(url, init);

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeoutOptions.requestTimeoutMs);

        try {
            return await fetch(url, Object.assign({ signal: controller.signal }, init));
        } catch (err) {
            if (err.name !== 'AbortError') throw err;
            throw new FetchTimeoutError(
                'Fetch Request Timed Out',
                typeof url === 'string' ? url : url.url,
                cloneDeep(init as RequestInit),
                timeoutOptions.requestTimeoutMs,
            );
        } finally {
            clearTimeout(timeoutId);
        }
    };

export * from './errors';
