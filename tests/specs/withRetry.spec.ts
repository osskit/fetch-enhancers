import { createServer } from 'node:http';
import type { AddressInfo } from 'node:net';

import { withRetry } from '../../src/index.js';

const retryFetch = withRetry(fetch);

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

    await expect(
      new Promise<void>((resolve, reject) => {
        server.listen(async () => {
          const { port } = server.address() as AddressInfo;
          try {
            const res = await retryFetch(`http://127.0.0.1:${port}`);
            expect(await res.text()).toBe('ha');
            server.close();
            resolve();
          } catch (error) {
            reject(error);
          }
        });
        server.on('error', reject);
      }),
    ).resolves.toBeUndefined();
  });

  it('resolves on > MAX_RETRIES', async () => {
    let tries = 0;

    const server = createServer((_, res) => {
      tries++;
      res.writeHead(500);
      res.end();
    });

    await expect(
      new Promise<void>((resolve, reject) => {
        server.listen(async () => {
          const { port } = server.address() as AddressInfo;
          const res = await retryFetch(`http://127.0.0.1:${port}`);
          expect(res.status).toBe(500);
          server.close();
          resolve();
        });
        server.on('error', reject);
      }),
    ).resolves.toBeUndefined();

    expect(tries).toBe(3);
  });

  it('resolves on < 500', async () => {
    let tries = 0;

    const server = createServer((_, res) => {
      tries++;
      res.writeHead(404);
      res.end();
    });

    await expect(
      new Promise<void>((resolve, reject) => {
        server.listen(async () => {
          const { port } = server.address() as AddressInfo;
          const res = await retryFetch(`http://127.0.0.1:${port}`);
          expect(res.status).toBe(404);
          server.close();
          resolve();
        });
        server.on('error', reject);
      }),
    ).resolves.toBeUndefined();

    expect(tries).toBe(1);
  });
});
