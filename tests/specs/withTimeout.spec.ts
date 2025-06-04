import { createServer } from 'node:http';
import type { AddressInfo } from 'node:net';
import { describe, it, expect } from 'vitest';
import pReflect from 'p-reflect';
import { withTimeout, FetchError } from '../../src/index.js';
import { waitForServer } from '../services/waitForServer.js';

const timeoutOptions = { requestTimeoutMs: 10000 };
const timeoutFetch = withTimeout(fetch, timeoutOptions);

describe('withTimeout', () => {
  it('single request configuration - times out when server does not respond in time', async () => {
    const server = createServer((_, res) => {
      setTimeout(() => {
        res.writeHead(200);
        res.end();
      }, 60000);
    });

    await waitForServer(server);

    const { port } = server.address() as AddressInfo;
    const result = await pReflect(timeoutFetch(`http://127.0.0.1:${port}`));
    const error = result.isRejected ? result.reason : null;
    expect(error).toBeInstanceOf(FetchError);
    expect((error as FetchError).status).toBe(504);
    expect((error as FetchError).data).toStrictEqual({ timeoutOptions });
    server.close();
  });
});
