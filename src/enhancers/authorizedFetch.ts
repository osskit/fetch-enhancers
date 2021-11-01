import nodeFetch, { Request, RequestInit, Response } from 'node-fetch';

export type FetchAPI = (url: string | Request, init?: RequestInit) => Promise<Response>;

export const authorizedFetch =
    (getToken: () => Promise<string> | string, fetch?: FetchAPI, init: RequestInit = {}) =>
    async (url: string | Request, innerInit: RequestInit = {}): Promise<Response> => {
        const innerFetch = fetch || nodeFetch;
        const token = await getToken();
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
