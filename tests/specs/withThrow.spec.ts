import { createServer } from 'node:http';
import type { AddressInfo } from 'node:net';

import { withThrow, FetchError } from '../../src/index.js';

const throwingFetch = withThrow(fetch);

describe('withThrow', () => {
  it('throws error when fetch fails', async () => {
    const server = createServer((_, res) => {
      const serverError = { type: 'mySpecialError' };

      res.writeHead(400, {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        'Content-Type': 'application/json',
      });
      res.end(JSON.stringify(serverError));
    });

    await expect(
      new Promise<void>((resolve, reject) => {
        server.listen(async () => {
          const { port } = server.address() as AddressInfo;
          try {
            await throwingFetch(`http://127.0.0.1:${port}`);
            reject(new Error('should not be here'));
          } catch (error: unknown) {
            expect(error).toBeInstanceOf(FetchError);
            expect((error as FetchError).data?.type).toBe('mySpecialError');
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
