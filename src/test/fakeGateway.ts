import { vi } from 'vitest';

import { ALL_BOOKS, PRIVATE_BOOKS } from './books';

interface FakeResponses {
  get?: Record<string, unknown>;
  post?: unknown;
}

export const fakeGateway = ({
  get = { '/': ALL_BOOKS, '/private': PRIVATE_BOOKS },
  post = { status: 'ok' },
}: FakeResponses = {}) => ({
  get: vi
    .fn()
    .mockImplementation((path: string) =>
      path in get
        ? Promise.resolve(get[path])
        : Promise.reject(new Error(`fakeGateway: no response for GET ${path}`)),
    ),
  post: vi.fn().mockResolvedValue(post),
});
