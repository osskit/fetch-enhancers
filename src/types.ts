import type { RequestInfo, RequestInit, Response } from 'node-fetch';
export type Fetch = (url: RequestInfo, init?: RequestInit) => Promise<Response>;
