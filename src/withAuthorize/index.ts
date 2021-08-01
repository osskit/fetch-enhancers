import cloneDeep from 'lodash.clonedeep';
import { Request, RequestInit } from 'node-fetch';

import { FetchEnhancerWithMandatoryOptions } from '../types';

import generateAuthorizedFetch, { AuthenticationParams } from './authorizedFetch';
import { FetchAuthorizationError } from '../authErrors';

export const withAuthorize: FetchEnhancerWithMandatoryOptions<{
    authenticationParams: AuthenticationParams;
    init?: RequestInit | undefined;
}> =
    (fetch, options) =>
    async (url: string | Request, init: RequestInit = {}) => {
        const authorizedFetch = generateAuthorizedFetch(options.authenticationParams, fetch, options.init);

        const response = await authorizedFetch(url, init);
        if (!response.ok) {
            const responseText = await response.text();
            throw new FetchAuthorizationError(responseText || 'fetch error', url, cloneDeep(init as RequestInit));
        }
        return response;
    };
