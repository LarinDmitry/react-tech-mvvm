// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { Form } from './Form';

afterEach(cleanup);

describe('Form', () => {
  it('calls onSubmit without reloading the page', () => {
    const onSubmit = vi.fn();
    render(
      <Form onSubmit={onSubmit}>
        <button type="submit">Send</button>
      </Form>,
    );

    const notPrevented = fireEvent.submit(screen.getByRole('button', { name: 'Send' }));

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(notPrevented).toBe(false);
  });
});
