export interface FetchErrorProperties<T> {
  message: string;
  url: string;
  status?: number;
  data?: T;
}

export class FetchError<T = Record<string, string>> extends Error {
  url: string;

  status?: number;

  data?: T;

  constructor({ message, url, status, data }: FetchErrorProperties<T>) {
    super(message);
    this.url = url;
    this.status = status;
    this.data = data;
    this.name = 'FetchError';
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      url: this.url,
      status: this.status,
      data: this.data,
    };
  }
}

export function isFetchError(error: any): error is FetchError {
  return Boolean(error && error.name === 'FetchError');
}
