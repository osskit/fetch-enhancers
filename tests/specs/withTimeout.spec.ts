import { createServer } from 'http';
import { AddressInfo } from 'net';
import fetch, { FetchError } from 'node-fetch';

import { withTimeout } from '../../src/enhancers/withTimeout';

test('single request configuration - times out when server does not respond in time ', async () => {
  const timeoutFetch = withTimeout(fetch, { requestTimeoutMs: 100 });
  const server = createServer((_, res) => {
    setTimeout(() => {
      res.writeHead(200);
      res.end();
    }, 2000);
  });

  return new Promise<void>((resolve, reject) => {
    server.listen(async () => {
      const { port } = server.address() as AddressInfo;
      try {
        await timeoutFetch(`http://127.0.0.1:${port}`);
        reject();
      } catch (err) {
        expect(err instanceof FetchError).toBeTruthy();
        resolve();
      } finally {
        server.close();
      }
    });
    server.on('error', reject);
  });
});

test('global configuration - times out when server does not respond in time ', async () => {
  const timeoutFetch = withTimeout(fetch, { requestTimeoutMs: 100 });
  const server = createServer((_, res) => {
    setTimeout(() => {
      res.writeHead(200);
      res.end();
    }, 2000);
  });

  return new Promise<void>((resolve, reject) => {
    server.listen(async () => {
      const { port } = server.address() as AddressInfo;
      try {
        await timeoutFetch(`http://127.0.0.1:${port}`);
        reject();
      } catch (err) {
        expect(err instanceof FetchError).toBeTruthy();
        resolve();
      } finally {
        server.close();
      }
    });
    server.on('error', reject);
  });
});
