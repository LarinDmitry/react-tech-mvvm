// @vitest-environment jsdom
import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { useContainer } from './container';

describe('useContainer', () => {
  it('fails loudly when there is no provider', () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);

    expect(() => renderHook(() => useContainer())).toThrow('ContainerContext is not provided');
  });
});
