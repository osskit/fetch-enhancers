import { createServer } from 'http';
import { AddressInfo } from 'net';
import fetch from 'node-fetch';

import { withThrow, FetchError } from '../../src';

const throwingFetch = withThrow(fetch);

test('throws error when fetch fails ', async () => {
  const server = createServer((_, res) => {
    const serverError = { type: 'mySpecialError' };

    res.writeHead(400, {
      'Content-Type': 'application/json',
    });
    res.end(JSON.stringify(serverError));
  });

  return new Promise<void>((resolve, reject) => {
    server.listen(async () => {
      const { port } = server.address() as AddressInfo;
      try {
        await throwingFetch(`http://127.0.0.1:${port}`);
        reject();
      } catch (err: unknown) {
        expect(err).toBeInstanceOf(FetchError);
        expect((err as FetchError).data?.type).toBe('mySpecialError');
        resolve();
      } finally {
        server.close();
      }
    });
    server.on('error', reject);
  });
});

