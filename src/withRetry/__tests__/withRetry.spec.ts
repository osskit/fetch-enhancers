import {createServer} from 'http';
import {AddressInfo} from 'net';
import fetch from 'node-fetch';

import {withRetry} from '../';

const retryFetch = withRetry(fetch);
test('retries upon 500', async () => {
    let i = 0;
    const server = createServer((_, res) => {
        if (i++ < 2) {
            res.writeHead(500);
            res.end();
        } else {
            res.end('ha');
        }
    });

    return new Promise<void>((resolve, reject) => {
        server.listen(async () => {
            const {port} = server.address() as AddressInfo;
            try {
                const res = await retryFetch(`http://127.0.0.1:${port}`);
                expect(await res.text()).toBe('ha');
                server.close();
                resolve();
            } catch (err) {
                reject(err);
            }
        });
        server.on('error', reject);
    });
});

test('throws upon ECONNREFUSED', async () => {
    const expected = {
        name: 'FetchError',
        message: 'request to http://127.0.0.1:80/ failed, reason: connect ECONNREFUSED 127.0.0.1:80',
    };

    try {
        await retryFetch(`http://127.0.0.1:80`);
    } catch (err) {
        expect(err.status).toBeUndefined();
        expect(err.name).toBe(expected.name);
        expect(err.message).toBe(expected.message);
    }
});

test('resolves on >MAX_RETRIES', async () => {
    const server = createServer((_, res) => {
        res.writeHead(500);
        res.end();
    });

    return new Promise<void>((resolve, reject) => {
        server.listen(async () => {
            const {port} = server.address() as AddressInfo;
            const res = await retryFetch(`http://127.0.0.1:${port}`);
            expect(res.status).toBe(500);
            server.close();
            return resolve();
        });
        server.on('error', reject);
    });
});
