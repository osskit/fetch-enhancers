import { createServer } from 'node:http';
import type { AddressInfo } from 'node:net';
import { describe, it, expect } from 'vitest';
import { withToken } from '../../src/index.js';
import { waitForServer } from '../services/waitForServer.js';

describe('withToken', () => {
  it('adds token to headers', async () => {
    const server = createServer((req, res) => {
      const response = JSON.stringify({
        authorization: req.headers.authorization,
      });
      res.writeHead(200);
      res.end(response);
    });

    await waitForServer(server);
    const { port } = server.address() as AddressInfo;
    const fetchWithToken = withToken(() => 'mytoken', fetch);
    const res = await fetchWithToken(`http://127.0.0.1:${port}`);

    await expect(res.text()).resolves.toBe('{"authorization":"Bearer mytoken"}');
  });

  it('merges headers when init.headers is a Headers instance', async () => {
    const server = createServer((req, res) => {
      const response = JSON.stringify({
        authorization: req.headers.authorization,
        foo: req.headers.foo,
      });
      res.writeHead(200);
      res.end(response);
    });
    await waitForServer(server);
    const { port } = server.address() as AddressInfo;
    const headers = new Headers({ foo: 'bar' });
    const fetchWithToken = withToken(() => 'mytoken', fetch);
    const res = await fetchWithToken(`http://127.0.0.1:${port}`, { headers });

    await expect(res.text()).resolves.toBe('{"authorization":"Bearer mytoken","foo":"bar"}');

    server.close();
  });
});
