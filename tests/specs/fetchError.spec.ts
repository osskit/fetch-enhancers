import { describe, it, expect } from 'vitest';
import { FetchError } from '../../src/index.js';

describe('fetchError', () => {
  it('show serialize', async () => {
    const error = new FetchError({
      status: 400,
      url: 'http://localhost',
      data: { type: 'mySpecialError' },
      message: 'error',
    });

    expect(JSON.stringify(error)).toBe(
      '{"name":"FetchError","message":"error","url":"http://localhost","status":400,"data":{"type":"mySpecialError"}}',
    );
  });
});
