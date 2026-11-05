import { describe, expect, it } from 'vitest';

import { createRequestState } from './createRequestState';

describe('createRequestState', () => {
  it('is loading until the request resolves, then ready', async () => {
    const state = createRequestState();

    const running = state.run(() => Promise.resolve());
    expect(state.status).toBe('loading');

    await running;
    expect(state.status).toBe('ready');
  });

  it('becomes error when the request rejects', async () => {
    const state = createRequestState();

    await state.run(() => Promise.reject(new Error('boom')));

    expect(state.status).toBe('error');
  });

  it('goes back to loading on the next run', async () => {
    const state = createRequestState();
    await state.run(() => Promise.reject(new Error('boom')));

    const running = state.run(() => Promise.resolve());
    expect(state.status).toBe('loading');
    await running;
    expect(state.status).toBe('ready');
  });
});
