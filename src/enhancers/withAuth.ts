import cloneDeep from 'lodash.clonedeep';
import { Issuer, Client, TokenSet, custom } from 'openid-client';
import nodeFetch, { Request, RequestInit, Response } from 'node-fetch';

import { FetchEnhancerWithMandatoryOptions, FetchAuthorizationError } from '../types';

export const withAuth: FetchEnhancerWithMandatoryOptions<{
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

const pReflect = async <T>(promise: Promise<T>) => {
    try {
        const value = await promise;

        return {
            isFulfilled: true,
            isRejected: false,
            value,
        };
    } catch (error) {
        return {
            isFulfilled: false,
            isRejected: true,
            reason: error,
        };
    }
};
custom.setHttpOptionsDefaults({
    timeout: 30000,
});

export interface AuthenticationParams {
    issuer: string;
    clientId: string;
    clientSecret: string;
    resource: string;
    scope?: string;
    onTokenExpired?: () => void;
}

export type FetchAPI = (url: string | Request, init?: RequestInit) => Promise<Response>;

const tokens: Record<string, Promise<TokenSet>> = {};

const getToken = (resource: string): Promise<TokenSet> | undefined => tokens[resource];

const setToken = (resource: string, token: Promise<TokenSet>) => {
    tokens[resource] = token;
};

const cachedClients: Record<string, Client> = {};

const getClient = async (issuer: string, clientId: string, clientSecret: string): Promise<Client> => {
    if (!cachedClients[issuer]) {
        const oidcIssuer = await Issuer.discover(issuer);
        const cachedClient = new oidcIssuer.Client({
            client_id: clientId,
            client_secret: clientSecret,
        });
        cachedClients[issuer] = cachedClient;
    }
    return cachedClients[issuer];
};

const isInvalid = async (tokenPromise: Promise<TokenSet>) => {
    const { isRejected, value } = await pReflect(tokenPromise);
    return isRejected || value?.expired();
};

export const getAuthenticationToken = async ({
    issuer,
    clientId,
    clientSecret,
    resource,
    onTokenExpired,
    scope,
}: AuthenticationParams): Promise<string | undefined> => {
    let tokenPromise: Promise<TokenSet> | undefined = getToken(resource);

    if (resource && scope) {
        throw new Error('Both "scope" and "resource" properties are not allowed. Use only one of them.');
    }

    if (!tokenPromise || (await isInvalid(tokenPromise))) {
        if (onTokenExpired) onTokenExpired();
        tokenPromise = getClient(issuer, clientId, clientSecret).then((client) =>
            client.grant({
                grant_type: 'client_credentials',
                resource: scope ?? resource,
                scope: scope ?? resource, // Support for non-Azure oidc providers
            }),
        );
        setToken(resource, tokenPromise);
    }

    const token = await tokenPromise;
    return token.access_token;
};

export const generateAuthorizedFetch =
    (authenticationParams: AuthenticationParams, fetch?: FetchAPI, init: RequestInit = {}) =>
    async (url: string | Request, innerInit: RequestInit = {}): Promise<Response> => {
        const innerFetch = fetch || nodeFetch;
        const token = await getAuthenticationToken(authenticationParams);
        return innerFetch(url, {
            ...innerInit,
            ...init,
            headers: {
                ...innerInit.headers,
                ...init.headers,
                Authorization: `Bearer ${token}`,
            },
        });
    };
