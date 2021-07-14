import {Request, RequestInit} from 'node-fetch';

export class FetchAuthorizationError extends Error {
    constructor(message: string, url: string | Request, requestInit: RequestInit) {
        super(message);
        Object.setPrototypeOf(this, FetchAuthorizationError.prototype);
        this.url = url.toString();
        this.requestInit = requestInit;
        this.status = 403;
    }
    status: number;
    url: string;
    requestInit: RequestInit;
}
