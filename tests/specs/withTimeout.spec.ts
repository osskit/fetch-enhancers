import { createServer } from 'http';
import { AddressInfo } from 'net';
import fetch from 'node-fetch';

import { withTimeout } from '../../src/enhancers/withTimeout.js';
import { FetchError } from '../../src/types.js';

const timeoutFetch = withTimeout(fetch, { requestTimeoutMs: 100 });

test('single request configuration - times out when server does not respond in time ', async () => {
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
        expect(err).toBeInstanceOf(FetchError);
        resolve();
      } finally {
        server.close();
      }
    });
    server.on('error', reject);
  });
});

test('global configuration - times out when server does not respond in time ', async () => {
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
        expect(err).toBeInstanceOf(FetchError);
        resolve();
      } finally {
        server.close();
      }
    });
    server.on('error', reject);
  });
});
