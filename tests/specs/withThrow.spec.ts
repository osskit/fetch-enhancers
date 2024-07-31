import { createServer } from 'node:http';
import type { AddressInfo } from 'node:net';
import { describe, it, expect } from 'vitest';
import pReflect from 'p-reflect';
import { withThrow, FetchError } from '../../src/index.js';
import { waitForServer } from '../services/waitForServer.js';

const throwingFetch = withThrow(fetch);

describe('withThrow', () => {
  it('throws error when fetch fails', async () => {
    const server = createServer((_, res) => {
      const serverError = { type: 'mySpecialError' };

      res.writeHead(400, {
        'Content-Type': 'application/json',
      });
      res.end(JSON.stringify(serverError));
    });

    await waitForServer(server);

    const { port } = server.address() as AddressInfo;
    const result = await pReflect(throwingFetch(`http://127.0.0.1:${port}`));
    const error = result.isRejected ? result.reason : null;
    expect(error).toBeInstanceOf(FetchError);
    expect((error as FetchError).status).toBe(400);
    server.close();
  });
});
