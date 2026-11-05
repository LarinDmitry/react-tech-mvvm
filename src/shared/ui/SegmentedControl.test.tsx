// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { SegmentedControl } from './SegmentedControl';

afterEach(cleanup);

const OPTIONS = [
  { value: 'a', label: 'First', isSelected: true },
  { value: 'b', label: 'Second', isSelected: false },
] as const;

describe('SegmentedControl', () => {
  it('marks the selected option as pressed', () => {
    render(<SegmentedControl label="Filter" options={OPTIONS} onChange={vi.fn()} />);

    expect(screen.getByRole('group', { name: 'Filter' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'First', pressed: true })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Second', pressed: false })).toBeTruthy();
  });

  it('passes the clicked value to onChange', () => {
    const onChange = vi.fn();
    render(<SegmentedControl label="Filter" options={OPTIONS} onChange={onChange} />);

    fireEvent.click(screen.getByRole('button', { name: 'Second' }));

    expect(onChange).toHaveBeenCalledWith('b');
  });
});
