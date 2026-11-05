// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { TextField } from './TextField';

afterEach(cleanup);

describe('TextField', () => {
  it('gives onChange the new string', () => {
    const onChange = vi.fn();
    render(<TextField label="Name" value="" onChange={onChange} />);

    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Dune' } });

    expect(onChange).toHaveBeenCalledWith('Dune');
  });

  it('can be disabled', () => {
    render(<TextField label="Name" value="" disabled onChange={vi.fn()} />);

    expect(screen.getByLabelText<HTMLInputElement>('Name').disabled).toBe(true);
  });
});
