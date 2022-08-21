import { createServer } from 'node:http';
import type { AddressInfo } from 'node:net';
import fetch from 'node-fetch';

import { withTimeout, FetchError } from '../../src/index.js';

const timeoutFetch = withTimeout(fetch, { requestTimeoutMs: 100 });

describe('withTimeout', () => {
  it('single request configuration - times out when server does not respond in time', async () => {
    const server = createServer((_, res) => {
      setTimeout(() => {
        res.writeHead(200);
        res.end();
      }, 2000);
    });

    await expect(
      new Promise<void>((resolve, reject) => {
        server.listen(async () => {
          const { port } = server.address() as AddressInfo;
          try {
            await timeoutFetch(`http://127.0.0.1:${port}`);
            reject(new Error('should not get here'));
          } catch (error) {
            expect(error).toBeInstanceOf(FetchError);
            resolve();
          } finally {
            server.close();
          }
        });
        server.on('error', reject);
      }),
    ).resolves.toBeUndefined();
  });

  it('global configuration - times out when server does not respond in time', async () => {
    const server = createServer((_, res) => {
      setTimeout(() => {
        res.writeHead(200);
        res.end();
      }, 2000);
    });

    await expect(
      new Promise<void>((resolve, reject) => {
        server.listen(async () => {
          const { port } = server.address() as AddressInfo;
          try {
            await timeoutFetch(`http://127.0.0.1:${port}`);
            reject(new Error('should not get here'));
          } catch (error) {
            expect(error).toBeInstanceOf(FetchError);
            resolve();
          } finally {
            server.close();
          }
        });
        server.on('error', reject);
      }),
    ).resolves.toBeUndefined();
  });
});
