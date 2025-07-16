import { createServer } from 'node:http';
import type { AddressInfo } from 'node:net';
import { describe, it, expect } from 'vitest';
import { withBasicAuth } from '../../src/index.js';
import { waitForServer } from '../services/waitForServer.js';

const username = 'user';
const password = 'pass';
const basicAuth = `Basic ${Buffer.from(`${username}:${password}`, 'binary').toString('base64')}`;

describe('withBasicAuth', () => {
  it('adds basic auth to headers', async () => {
    const server = createServer((req, res) => {
      const response = JSON.stringify({
        authorization: req.headers.authorization,
      });
      res.writeHead(200);
      res.end(response);
    });

    await waitForServer(server);
    const { port } = server.address() as AddressInfo;
    const fetchWithBasicAuth = withBasicAuth(fetch, { username, password });
    const res = await fetchWithBasicAuth(`http://127.0.0.1:${port}`);

    await expect(res.text()).resolves.toBe(`{"authorization":"${basicAuth}"}`);

    server.close();
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
    const fetchWithBasicAuth = withBasicAuth(fetch, { username, password });
    const res = await fetchWithBasicAuth(`http://127.0.0.1:${port}`, { headers });

    await expect(res.text()).resolves.toBe(`{"authorization":"${basicAuth}","foo":"bar"}`);

    server.close();
  });
});
