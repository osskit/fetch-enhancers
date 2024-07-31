import { createServer } from 'node:http';
import type { AddressInfo } from 'node:net';
import { describe, expect, it } from 'vitest';
import type { FetchError } from '../../src/index.js';
import { withRetry } from '../../src/index.js';
import { waitForServer } from '../services/waitForServer.js';

const retries = 3;

const retryFetch = withRetry(fetch, {
  minTimeout: 1000,
  maxTimeout: 5000,
  randomize: false,
  retries,
  factor: 1.5,
  onRetry: (error: FetchError) => error,
});

describe('withRetry', () => {
  it('retries upon 500', async () => {
    let tries = 0;

    const server = createServer((_, res) => {
      if (tries++ < 2) {
        res.writeHead(500);
        res.end();
        return;
      }

      res.end('ha');
    });

    await waitForServer(server);

    const { port } = server.address() as AddressInfo;
    const res = await retryFetch(`http://127.0.0.1:${port}`);
    await expect(res.text()).resolves.toBe('ha');

    server.close();
  });

  it('resolves on > MAX_RETRIES', async () => {
    let tries = 0;

    const server = createServer((_, res) => {
      tries++;
      res.writeHead(500);
      res.end();
    });

    await waitForServer(server);

    const { port } = server.address() as AddressInfo;
    const res = await retryFetch(`http://127.0.0.1:${port}`);
    expect(res.status).toBe(500);
    server.close();

    expect(tries).toBe(retries);
  });

  it('resolves on < 500', async () => {
    let tries = 0;

    const server = createServer((_, res) => {
      tries++;
      res.writeHead(404);
      res.end();
    });

    await waitForServer(server);

    const { port } = server.address() as AddressInfo;
    const res = await retryFetch(`http://127.0.0.1:${port}`);
    expect(res.status).toBe(404);
    server.close();

    expect(tries).toBe(1);
  });
});
