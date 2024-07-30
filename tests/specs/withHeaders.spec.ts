import { createServer } from 'node:http';
import type { AddressInfo } from 'node:net';
import { describe, it, expect } from 'vitest';
import { withHeaders } from '../../src/index.js';
import { waitForServer } from '../services/waitForServer.js';

const fetchWithHeaders = withHeaders(fetch, () => ({ foo: 'bar' }));

describe('withHeaders', () => {
  it('throws error when fetch fails', async () => {
    const server = createServer((req, res) => {
      const response = req.headers.foo;

      res.writeHead(200);
      res.end(response);
    });

    await waitForServer(server);

    const { port } = server.address() as AddressInfo;
    const res = await fetchWithHeaders(`http://127.0.0.1:${port}`);
    await expect(res.text()).resolves.toBe('bar');
    server.close();
  });

  const fetchWithExtraHeaders = withHeaders(fetch, () => ({ foo: 'bar', id: 'override' }));

  it('add headers', async () => {
    const server = createServer((req, res) => {
      const response = req.headers.id;

      res.writeHead(200);
      res.end(response);
    });

    await waitForServer(server);

    const { port } = server.address() as AddressInfo;
    const res = await fetchWithExtraHeaders(`http://127.0.0.1:${port}`, { headers: { id: 'id' } });
    await expect(res.text()).resolves.toBe('override');
    server.close();
  });
});
