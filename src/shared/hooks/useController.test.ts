// @vitest-environment jsdom
import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { useController } from './useController';

describe('useController', () => {
  it('creates the controller once, inits it on mount and disposes it on unmount', () => {
    const controller = { init: vi.fn(), dispose: vi.fn() };
    const create = vi.fn(() => controller);

    const { result, rerender, unmount } = renderHook(() => useController(create));
    rerender();
    rerender();

    expect(result.current).toBe(controller);
    expect(create).toHaveBeenCalledTimes(1);
    expect(controller.init).toHaveBeenCalledTimes(1);
    expect(controller.dispose).not.toHaveBeenCalled();

    unmount();
    expect(controller.dispose).toHaveBeenCalledTimes(1);
  });

  it('works with controllers that have no init or dispose', () => {
    const { result, unmount } = renderHook(() => useController(() => ({ value: 1 })));

    expect(result.current.value).toBe(1);
    expect(unmount).not.toThrow();
  });
});
