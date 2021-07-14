import {RequestInit} from 'node-fetch';

export class FetchTimeoutError extends Error {
    constructor(message: string, url: string, requestInit: RequestInit, timeout: number) {
        super(message);
        Object.setPrototypeOf(this, FetchTimeoutError.prototype);
        this.url = url;
        this.requestInit = requestInit;
        this.timeout = timeout;
        this.status = 408;
    }
    status: number;
    url: string;
    requestInit: RequestInit;
    timeout: number;
}
