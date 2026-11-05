import { describe, expect, it, vi } from 'vitest';

import { createHttpGateway } from './HttpGateway';

const BASE = 'https://api.test/v1/books/user';

const fakeFetch = (body: unknown, init: { ok?: boolean; status?: number } = {}) =>
  vi.fn<typeof fetch>().mockResolvedValue({
    ok: init.ok ?? true,
    status: init.status ?? 200,
    json: () => Promise.resolve(body),
  } as Response);

describe('HttpGateway', () => {
  it('GET requests base URL + path and returns parsed JSON', async () => {
    const fetchFn = fakeFetch([{ name: 'A' }]);
    const gateway = createHttpGateway(BASE, fetchFn);

    await expect(gateway.get('/')).resolves.toEqual([{ name: 'A' }]);
    expect(fetchFn).toHaveBeenCalledWith(`${BASE}/`, undefined);
  });

  it('POST sends JSON body with JSON content type', async () => {
    const fetchFn = fakeFetch({ status: 'ok' });
    const gateway = createHttpGateway(BASE, fetchFn);

    await expect(gateway.post('/', { name: 'A', author: 'B' })).resolves.toEqual({ status: 'ok' });
    expect(fetchFn).toHaveBeenCalledWith(`${BASE}/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'A', author: 'B' }),
    });
  });

  it('rejects on non-2xx response', async () => {
    const gateway = createHttpGateway(BASE, fakeFetch(null, { ok: false, status: 404 }));

    await expect(gateway.get('/missing')).rejects.toThrow('HTTP 404 for /missing');
  });
});
