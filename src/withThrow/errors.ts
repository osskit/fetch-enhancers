import {Request, RequestInit} from 'node-fetch';

export class FetchError extends Error {
    constructor(message: string, url: string | Request, requestInit: RequestInit, status: number) {
        super(message);
        Object.setPrototypeOf(this, FetchError.prototype);
        this.url = url;
        this.requestInit = requestInit;
        this.status = status;
    }
    url: string | Request;
    requestInit: RequestInit;
    status: number;
}
