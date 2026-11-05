import { afterEach, describe, expect, it, vi } from 'vitest';

import { getApiBase } from './config';

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('getApiBase', () => {
  it('returns VITE_API_BASE', () => {
    vi.stubEnv('VITE_API_BASE', 'https://api.test/v1/books/user');

    expect(getApiBase()).toBe('https://api.test/v1/books/user');
  });

  it('fails with a clear message when VITE_API_BASE is not set', () => {
    vi.stubEnv('VITE_API_BASE', '');

    expect(getApiBase).toThrow('VITE_API_BASE is not set');
  });
});
