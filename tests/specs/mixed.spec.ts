import { createServer } from 'node:http';
import type { AddressInfo } from 'node:net';
import { describe, it, expect } from 'vitest';
import { withThrow, withRetry, withTimeout, withBasicAuth } from '../../src/index.js';
import { waitForServer } from '../services/waitForServer.js';

describe('mixed', () => {
  it('mixed', async () => {
    const retryOpts = {
      onRetry: (_: Error) => {
        console.log('hi!');
      },
    };
    const timeoutOpts = {
      requestTimeoutMs: 10_000,
    };
    const basicAuthOpts = {
      username: 'hi',
      password: 'bye',
    };
    const enhancedFetch = withThrow(withBasicAuth(withTimeout(withRetry(fetch, retryOpts), timeoutOpts), basicAuthOpts));
    const server = createServer((_, res) => {
      res.writeHead(200);
      res.end();
    });

    await waitForServer(server);

    const { port } = server.address() as AddressInfo;
    await expect(enhancedFetch(`http://127.0.0.1:${port}`)).resolves.toBeInstanceOf(Response);
    server.close();
  });
});
