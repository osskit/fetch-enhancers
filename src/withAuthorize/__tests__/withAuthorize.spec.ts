import {createServer} from 'http';
import {AddressInfo} from 'net';
import fetch from 'node-fetch';
import {v4 as uuid} from 'uuid';

import {withAuthorize} from '..';

import mockOidsServer from './mockOidsServer';

test('Server doesnt exist - should fail', async () => {
    const authorizedFetch = withAuthorize(fetch, {
        authenticationParams: {
            clientId: uuid(),
            clientSecret: uuid(),
            resource: uuid(),
            issuer: 'http://localhost:8080',
        },
    });
    const server = createServer((_, res) => {
        setTimeout(() => {
            res.writeHead(200);
            res.end();
        }, 2000);
    });

    return new Promise<void>((resolve, reject) => {
        server.listen(async () => {
            const {port} = server.address() as AddressInfo;
            try {
                await authorizedFetch(`http://127.0.0.1:${port}`);
                reject();
            } catch (err) {
                resolve();
            } finally {
                server.close();
            }
        });
        server.on('error', reject);
    });
});

test('Server exists - should succeed', async () => {
    await mockOidsServer.mock();
    const authorizedFetch = withAuthorize(fetch, {
        authenticationParams: {
            clientId: uuid(),
            clientSecret: uuid(),
            issuer: 'http://localhost:8080',
            resource: uuid(),
        },
    });
    const server = createServer((_, res) => {
        setTimeout(() => {
            res.writeHead(200);
            res.end();
        }, 2000);
    });

    return new Promise<void>((resolve, reject) => {
        server.listen(async () => {
            const {port} = server.address() as AddressInfo;
            try {
                const res = await authorizedFetch(`http://127.0.0.1:${port}`);
                expect(res.status).toBe(200);
                mockOidsServer.stop();
                resolve();
            } catch (err) {
                reject();
            } finally {
                server.close();
            }
        });
        server.on('error', reject);
    });
});
