import { Request, RequestInit, Response } from 'node-fetch';
export type Fetch = (url: string | Request, init?: RequestInit) => Promise<Response>;
export type EnhancedFetchRequestInit<T> = RequestInit & {
    enhancers?: T;
};
export type EnhancedFetch<T> = (
    url: string | Request,
    init?: RequestInit & EnhancedFetchRequestInit<T>,
) => Promise<Response>;

export type FetchEnhancer<T1> = <T2 extends {}>(
    fetch: Fetch | EnhancedFetch<T2>,
    options?: T1,
) => EnhancedFetch<T1 & T2>;

export type FetchEnhancerWithMandatoryOptions<T1> = <T2 extends {}>(
    fetch: Fetch | EnhancedFetch<T2>,
    options: T1,
) => EnhancedFetch<T1 & T2>;
