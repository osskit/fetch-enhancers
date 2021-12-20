import { createServer } from 'http';
import { AddressInfo } from 'net';
import fetch  from 'node-fetch';

import { withThrow, FetchError } from '../../src';

const throwingFetch = withThrow(fetch);

test('throws error when fetch fails ', async () => {
  const server = createServer((_, res) => {
    res.writeHead(500);
    res.end();
  });

  return new Promise<void>((resolve, reject) => {
    server.listen(async () => {
      const { port } = server.address() as AddressInfo;
      try {
        await throwingFetch(`http://127.0.0.1:${port}`);
        reject();
      } catch (err) {
        expect(err).toBeInstanceOf(FetchError);
        resolve();
      } finally {
        server.close();
      }
    });
    server.on('error', reject);
  });
});
