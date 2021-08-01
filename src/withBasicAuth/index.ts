import cloneDeep from 'lodash.clonedeep';
import { Request, RequestInit } from 'node-fetch';

import { FetchEnhancerWithMandatoryOptions } from '../types';

import { FetchAuthorizationError } from '../authErrors';

export interface BasicAuthenticationParams {
    username: string;
    password: string;
}

export const withBasicAuth: FetchEnhancerWithMandatoryOptions<{
    authenticationParams: BasicAuthenticationParams;
    init?: RequestInit | undefined;
}> =
    (fetch, options) =>
    async (url: string | Request, init: RequestInit = {}) => {
        const {
            authenticationParams: { username, password },
        } = options;

        const response = await fetch(url, {
            ...init,
            headers: {
                Authorization: `Basic ${Buffer.from(`${username}:${password}`, 'binary').toString('base64')}`,
            },
        });

        if (!response.ok) {
            const responseText = await response.text();
            throw new FetchAuthorizationError(responseText || 'fetch error', url, cloneDeep(init as RequestInit));
        }
        return response;
    };
