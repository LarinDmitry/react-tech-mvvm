import { vi } from 'vitest';

interface FakeResponses {
  get?: Record<string, unknown>;
  post?: unknown;
}

export const fakeGateway = ({ get = {}, post = { status: 'ok' } }: FakeResponses = {}) => ({
  get: vi.fn().mockImplementation((path: string) => Promise.resolve(get[path])),
  post: vi.fn().mockResolvedValue(post),
});
