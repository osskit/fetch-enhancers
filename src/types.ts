import type { RequestInfo, RequestInit, Response } from 'node-fetch';
export type Fetch = (url: RequestInfo, init?: RequestInit) => Promise<Response>;

export class FetchError extends Error {
    message: string;
    url: string;
    data?: Record<string, string>;
    constructor(message: string, url: string, data?: Record<string, string>) {
        super(message);
        this.message = message;
        this.url = url;
        this.data = data;
    }
}
