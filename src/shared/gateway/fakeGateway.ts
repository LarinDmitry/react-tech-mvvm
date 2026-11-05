import { vi } from 'vitest';

export const fakeGateway = (response: unknown) => ({
  get: vi.fn().mockResolvedValue(response),
  post: vi.fn().mockResolvedValue(response),
});
