import type { Fetch } from '../types.js';
import { FetchError } from '../fetchError.js';

export interface TimeoutOptions {
  requestTimeoutMs: number;
}

const scheduleNext = (callback: () => void) => {
  if (typeof setImmediate !== 'undefined') {
    // Node.js
    setImmediate(callback);
  } else if (typeof requestAnimationFrame !== 'undefined') {
    // Browser
    requestAnimationFrame(callback);
  } else {
    // Fallback
    Promise.resolve().then(callback);
  }
};

const delay = (ms: number) => new Promise((resolve) => {
  const start = performance.now();
  const check = () => {
    if (performance.now() - start >= ms) {
      resolve(void 0);
    } else {
      scheduleNext(check);
    }
  };
  check();
});

export const withTimeout = (fetch: Fetch, options: TimeoutOptions) => async (url: string, init: RequestInit) => {
  const controller = new AbortController();
  const { requestTimeoutMs } = options;
  
  const timeoutPromise = delay(requestTimeoutMs).then(() => {
    controller.abort();
    throw new Error('request timeout');
  });
  
  try {
    const res = await Promise.race([
      fetch(url, { signal: controller.signal, ...init }),
      timeoutPromise
    ]);
    return res;
  } catch (error) {
    throw new FetchError({
      message: (error as Error).message ?? 'fetch error',
      url,
      status: 504,
      data: { timeoutOptions: options },
    });
  }
};