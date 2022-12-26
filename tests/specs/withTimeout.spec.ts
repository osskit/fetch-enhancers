import { createServer } from 'node:http';
import type { AddressInfo } from 'node:net';

import { withTimeout, FetchError } from '../../src/index.js';

const timeoutOptions = { requestTimeoutMs: 100 };
const timeoutFetch = withTimeout(fetch, timeoutOptions);

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
            expect((error as FetchError).status).toBe(504);
            expect((error as FetchError).data).toStrictEqual({ timeoutOptions });
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
