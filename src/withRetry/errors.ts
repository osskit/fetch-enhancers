import {RequestInit} from 'node-fetch';

export class FetchRetryError extends Error {
    constructor(
        message: string,
        url: string,
        attempt: number,
        requestInit: RequestInit,
        originalError?: Error,
        status?: number,
        statusText?: string,
        responseText?: string,
    ) {
        super(message);
        Object.setPrototypeOf(this, FetchRetryError.prototype);
        this.url = url;
        this.attempt = attempt;
        this.requestInit = requestInit;
        this.originalError = originalError;
        this.status = status;
        this.statusText = statusText;
        this.responseText = responseText;
    }
    url: string;
    attempt: number;
    requestInit: RequestInit;
    status?: number;
    statusText?: string;
    responseText?: string;
    originalError?: Error;
}

export const parseError = async (e: any) => {
    try {
        // e.text function should be fetch error
        if (e.text && typeof e.text === 'function') {
            try {
                const text = await e.clone().text();
                return JSON.parse(text);
            } catch {
                return {
                    status: e.status,
                    statusText: e.statusText,
                    url: e.url,
                };
            }
        }
        // Axios error has buffer properties, toJSON will create a nice object
        if (e.isAxiosError) {
            return e.toJSON();
        }
        if (e.response) {
            return {
                status: e.response.status,
                statusText: e.response.statusText,
                data: e.response.data,
            };
        }
        if (e.body) {
            try {
                return JSON.parse(e.body);
            } catch {
                return e.body;
            }
        }
        if (e instanceof Error) {
            return {name: e.name, message: e.message, stack: e.stack};
        }
        return e;
    } catch {
        return e;
    }
};
