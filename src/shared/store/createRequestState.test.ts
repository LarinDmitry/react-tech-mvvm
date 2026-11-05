import { describe, expect, it, vi } from 'vitest';

import { createRequestState } from './createRequestState';

const deferred = <T>() => {
  let resolve: (value: T) => void = () => undefined;
  let reject: (error: Error) => void = () => undefined;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
};

describe('createRequestState', () => {
  it('is loading until the request resolves, then applies the result and is ready', async () => {
    const state = createRequestState();
    const apply = vi.fn();

    const running = state.run(() => Promise.resolve(42), apply);
    expect(state.status).toBe('loading');
    expect(state.isLoaded).toBe(false);

    await running;
    expect(apply).toHaveBeenCalledWith(42);
    expect(state.status).toBe('ready');
    expect(state.isLoaded).toBe(true);
  });

  it('becomes error when the request rejects', async () => {
    const state = createRequestState();
    const apply = vi.fn();

    await state.run(() => Promise.reject(new Error('boom')), apply);

    expect(apply).not.toHaveBeenCalled();
    expect(state.status).toBe('error');
    expect(state.isLoaded).toBe(false);
  });

  it('stays loaded while reloading', async () => {
    const state = createRequestState();
    await state.run(() => Promise.resolve(1), vi.fn());

    const reloading = state.run(() => Promise.resolve(2), vi.fn());
    expect(state.status).toBe('loading');
    expect(state.isLoaded).toBe(true);
    await reloading;
  });

  it('ignores a slow earlier request that finishes after a newer one', async () => {
    const state = createRequestState();
    const apply = vi.fn();
    const slow = deferred<string>();
    const fast = deferred<string>();

    const slowRun = state.run(() => slow.promise, apply);
    const fastRun = state.run(() => fast.promise, apply);
    fast.resolve('new');
    await fastRun;
    slow.resolve('old');
    await slowRun;

    expect(apply).toHaveBeenCalledTimes(1);
    expect(apply).toHaveBeenCalledWith('new');
  });
});
