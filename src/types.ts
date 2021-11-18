import type { RequestInfo, RequestInit, Response, Request } from 'node-fetch';

export type Fetch = (url: RequestInfo, init?: RequestInit) => Promise<Response>;

export interface FetchErrorProperties {
  message: string;
  url: string;
  status?:number;
  data?: Record<string, string>;
}

export class FetchError extends Error {
  url: string;
  status?: number;
  data?: Record<string, string>;

  constructor({message, url, status, data}: FetchErrorProperties) {
    super(message);
    this.url = url;
    this.status = status;
    this.data = data;
    this.name = 'FetchError';
  }
}

export type EnhancedFetchRequestInit<T> = RequestInit & {
  enhancers?: T;
};
export type EnhancedFetch<T> = (url: Request | string, init?: EnhancedFetchRequestInit<T> & RequestInit) => Promise<Response>;

export type FetchEnhancer<T1> = <T2 extends {}>(fetch: EnhancedFetch<T2> | Fetch, options?: T1) => EnhancedFetch<T1 & T2>;

export type FetchEnhancerWithMandatoryOptions<T1> = <T2 extends {}>(
  fetch: EnhancedFetch<T2> | Fetch,
  options: T1,
) => EnhancedFetch<T1 & T2>;

export class FetchAuthorizationError extends Error {
  constructor(message: string, url: Request | string, requestInit: RequestInit) {
    super(message);
    this.url = JSON.stringify(url);
    this.requestInit = requestInit;
    this.status = 403;
    this.name = 'FetchAuthorizationError';
  }

  status: number;

  url: string;

  requestInit: RequestInit;
}
