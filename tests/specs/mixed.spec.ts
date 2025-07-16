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

  it('mixed with Request object', async () => {
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
    const request = new Request(`http://127.0.0.1:${port}`);

    await expect(enhancedFetch(request)).resolves.toBeInstanceOf(Response);

    server.close();
  });

  it('mixed with Request object, retries and timeout', async () => {
    const retryOpts = {
      onRetry: (_: Error) => {
        console.log('hi!');
      },
    };
    const timeoutOpts = {
      requestTimeoutMs: 10_000,
    };
    let tries = 0;

    const enhancedFetch = withRetry(withTimeout(fetch, timeoutOpts), retryOpts);
    const server = createServer((_, res) => {
      if (tries++ < 2) {
        res.writeHead(500);
        res.end();
        return;
      }
      res.writeHead(200);
      res.end();
    });

    await waitForServer(server);
    const { port } = server.address() as AddressInfo;
    const request = new Request(`http://127.0.0.1:${port}`, {
      method: 'POST',
      body: 'payload',
    });

    await expect(enhancedFetch(request)).resolves.toBeInstanceOf(Response);

    server.close();
  });
});
