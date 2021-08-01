import { createServer } from 'http';
import { AddressInfo } from 'net';
import fetch from 'node-fetch';

import { withThrow, FetchError } from '..';

test('throws error when fetch fails ', async () => {
    const throwingFetch = withThrow(fetch);
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
                expect(err instanceof FetchError).toBeTruthy();
                resolve();
            } finally {
                server.close();
            }
        });
        server.on('error', reject);
    });
});
