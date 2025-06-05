import { createServer } from 'node:http';
import type { AddressInfo } from 'node:net';
import { setTimeout } from 'node:timers/promises';
import { describe, it, expect } from 'vitest';
import pReflect from 'p-reflect';
import { withTimeout, FetchError } from '../../src/index.js';
import { waitForServer } from '../services/waitForServer.js';

const timeoutOptions = { requestTimeoutMs: 5000 };
const timeoutFetch = withTimeout(fetch, timeoutOptions);

describe('withTimeout', () => {
  it('times out when server does not respond in time', async () => {
    const server = createServer(async (_, res) => {
      await setTimeout(30_000);
      res.writeHead(200);
      res.end();
    });

    await waitForServer(server);

    const { port } = server.address() as AddressInfo;
    const result = await pReflect(timeoutFetch(`http://127.0.0.1:${port}`));
    const error = result.isRejected ? result.reason : null;
    expect(error).toBeInstanceOf(FetchError);
    expect((error as FetchError).message).toBe('request timeout');
    server.close();
  });

  it('should respect the signal', async () => {
    const server = createServer(async (_, res) => {
      await setTimeout(30_000);
      res.writeHead(200);
      res.end();
    });

    await waitForServer(server);

    const { port } = server.address() as AddressInfo;

    const controller = new AbortController();

    void setTimeout(1000).then(() => {
      controller.abort();
    });

    const result = await pReflect(timeoutFetch(`http://127.0.0.1:${port}`, { signal: controller.signal }));
    const error = result.isRejected ? result.reason : null;
    expect(error).toBeInstanceOf(FetchError);
    expect((error as FetchError).message).toBe('abort requested');
    server.close();
  });
}, 10_000);
