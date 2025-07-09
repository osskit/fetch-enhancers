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

  const fetchWithExtraHeaders = withHeaders(fetch, () => ({ foo: 'foo', id: 'override' }));

  it('add headers', async () => {
    const server = createServer((req, res) => {
      const response = JSON.stringify({ id: req.headers.id, bar: req.headers.bar, foo: req.headers.foo });

      res.writeHead(200);
      res.end(response);
    });

    await waitForServer(server);

    const { port } = server.address() as AddressInfo;
    const res = await fetchWithExtraHeaders(`http://127.0.0.1:${port}`, { headers: { id: 'id', bar: 'bar' } });
    await expect(res.text()).resolves.toMatchInlineSnapshot(`"{"id":"override","bar":"bar","foo":"foo"}"`);
    server.close();
  });

  it('add headers when getHeaders returns a promise', async () => {
    const fetchWithAsyncHeaders = withHeaders(fetch, async () => ({ foo: 'foo', id: 'override' }));
    const server = createServer((req, res) => {
      const response = JSON.stringify({ foo: req.headers.foo, bar: req.headers.bar });
      res.writeHead(200);
      res.end(response);
    });

    await waitForServer(server);
    const { port } = server.address() as AddressInfo;
    const res = await fetchWithAsyncHeaders(`http://127.0.0.1:${port}`, { headers: { id: 'id', bar: 'bar' } });
    await expect(res.text()).resolves.toMatchInlineSnapshot(`"{"id":"override","bar":"bar","foo":"foo"}"`);
    server.close();
  });

  it('merges headers when init.headers is a Headers instance', async () => {
    const server = createServer((req, res) => {
      const response = JSON.stringify({ foo: req.headers.foo, bar: req.headers.bar });
      res.writeHead(200);
      res.end(response);
    });

    await waitForServer(server);
    const { port } = server.address() as AddressInfo;
    const headers = new Headers({ bar: 'baz' });
    const fetchWithHeadersInstance = withHeaders(fetch, () => ({ foo: 'bar' }));
    const res = await fetchWithHeadersInstance(`http://127.0.0.1:${port}`, { headers });
    await expect(res.text()).resolves.toBe('{"foo":"bar","bar":"baz"}');
    server.close();
  });

  it('merges headers when init.headers is an object and getHeaders returns a Headers instance', async () => {
    const server = createServer((req, res) => {
      const response = JSON.stringify({ foo: req.headers.foo, bar: req.headers.bar });
      res.writeHead(200);
      res.end(response);
    });

    await waitForServer(server);
    const { port } = server.address() as AddressInfo;
    const headers = new Headers({ bar: 'baz' });
    const fetchWithHeadersInstance = withHeaders(fetch, () => new Headers({ foo: 'bar' }));
    const res = await fetchWithHeadersInstance(`http://127.0.0.1:${port}`, { headers });
    await expect(res.text()).resolves.toBe('{"foo":"bar","bar":"baz"}');
    server.close();
  });

  it('merges headers when init.headers is a Headers instance and getHeaders returns a Headers instance', async () => {
    const server = createServer((req, res) => {
      const response = JSON.stringify({ foo: req.headers.foo, bar: req.headers.bar });
      res.writeHead(200);
      res.end(response);
    });

    await waitForServer(server);
    const { port } = server.address() as AddressInfo;
    const headers = new Headers({ bar: 'baz' });
    const fetchWithHeadersInstance = withHeaders(fetch, () => new Headers({ foo: 'bar' }));
    const res = await fetchWithHeadersInstance(`http://127.0.0.1:${port}`, { headers });
    await expect(res.text()).resolves.toBe('{"foo":"bar","bar":"baz"}');
    server.close();
  });
});
