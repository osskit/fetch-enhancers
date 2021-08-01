import cloneDeep from 'lodash.clonedeep';
import { Request, RequestInit } from 'node-fetch';

import { FetchEnhancer } from '../types';

import { FetchError } from './errors';

export const withThrow: FetchEnhancer<undefined> =
    (fetch) =>
    async (url: string | Request, init: RequestInit = {}) => {
        const response = await fetch(url, init);
        if (!response.ok) {
            const responseText = await response.text();
            throw new FetchError(responseText || 'fetch error', url, cloneDeep(init as RequestInit), response.status);
        }
        return response;
    };

export * from './errors';
