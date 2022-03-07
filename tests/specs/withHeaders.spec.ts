import { createServer } from 'http';
import { AddressInfo } from 'net';
import fetch from 'node-fetch';

import { withHeaders } from '../../src';

const fetchWithHeaders = withHeaders(fetch, () => ({ foo: 'bar' }));

test('throws error when fetch fails ', async () => {
  const server = createServer((req, res) => {
    const response = req.headers['foo'];

    res.writeHead(200);
    res.end(response);
  });

  return new Promise<void>((resolve, reject) => {
    server.listen(async () => {
      const { port } = server.address() as AddressInfo;
      try {
        const res = await fetchWithHeaders(`http://127.0.0.1:${port}`);
        expect(await res.text()).toBe('bar');
        resolve();
      } finally {
        server.close();
      }
    });
    server.on('error', reject);
  });
});

const fetchWithExtraHeaders = withHeaders(fetch, (headers) => ({ ...headers, foo: 'bar', id: 'override' }));

test('add headers', async () => {
  const server = createServer((req, res) => {
    const response = req.headers['id'];

    res.writeHead(200);
    res.end(response);
  });

  return new Promise<void>((resolve, reject) => {
    server.listen(async () => {
      const { port } = server.address() as AddressInfo;
      try {
        const res = await fetchWithExtraHeaders(`http://127.0.0.1:${port}`, { headers: { id: 'id' } });
        expect(await res.text()).toBe('override');
        resolve();
      } finally {
        server.close();
      }
    });
    server.on('error', reject);
  });
});
