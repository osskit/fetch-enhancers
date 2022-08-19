import { createServer } from 'node:http';
import type { AddressInfo } from 'node:net';
import fetch from 'node-fetch';

import { withThrow, withRetry, withTimeout, withBasicAuth } from '../../src/index.js';

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

    await expect(
      new Promise<void>((resolve, reject) => {
        server.listen(async () => {
          const { port } = server.address() as AddressInfo;
          try {
            await enhancedFetch(`http://127.0.0.1:${port}`);
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
