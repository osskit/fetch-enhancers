import { createServer } from 'http';
import { AddressInfo } from 'net';
import fetch from 'node-fetch';

import {withThrow} from '../../src/enhancers/withThrow.js';
import {withRetry} from '../../src/enhancers/withRetry.js';
import {withTimeout} from '../../src/enhancers/withTimeout.js';
import {withBasicAuth} from '../../src/enhancers/withBasicAuth.js';

test('mixed ', async () => {
  const retryOpts = { onRetry: (_: Error) => console.log('hi!') };
  const timeoutOpts = {
    requestTimeoutMs: 10000,
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

  return new Promise<void>((resolve, reject) => {
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
  });
});
