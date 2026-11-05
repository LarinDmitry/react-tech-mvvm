// @vitest-environment jsdom
import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import { Profiler } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { BooksList } from '@/features/books/list/BooksList.view';
import { Header } from '@/features/header/Header.view';
import { fakeGateway } from '@/shared/gateway/fakeGateway';

import { renderWithContainer } from './renderWithContainer';

const ALL = [
  { id: 1, name: 'Dune', author: 'Frank Herbert' },
  { name: 'Mine', author: 'Me' },
];
const PRIVATE = [{ name: 'Mine', author: 'Me' }];

const gateway = () => fakeGateway({ get: { '/': ALL, '/private': PRIVATE } });

afterEach(cleanup);

describe('App views', () => {
  it('renders the list once on mount and once more when books arrive', async () => {
    const onRender = vi.fn();
    renderWithContainer(
      <Profiler id="list" onRender={onRender}>
        <BooksList />
      </Profiler>,
      gateway(),
    );

    expect(screen.getByText('Loading books…')).toBeTruthy();
    expect(await screen.findByText('Frank Herbert: Dune')).toBeTruthy();
    expect(onRender).toHaveBeenCalledTimes(2);
  });

  it('shows the private books counter in the header', async () => {
    renderWithContainer(<Header />, gateway());

    expect(await screen.findByText('Your books: 1')).toBeTruthy();
  });

  it('does not re-render the header when the list switches tabs', async () => {
    const onHeaderRender = vi.fn();
    renderWithContainer(
      <>
        <Profiler id="header" onRender={onHeaderRender}>
          <Header />
        </Profiler>
        <BooksList />
      </>,
      gateway(),
    );
    await screen.findByText('Your books: 1');
    await screen.findByText('Frank Herbert: Dune');
    const rendersBefore = onHeaderRender.mock.calls.length;

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Private books' }));
    });
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'All books' }));
    });

    expect(screen.getByRole('button', { name: 'All books', pressed: true })).toBeTruthy();
    expect(onHeaderRender).toHaveBeenCalledTimes(rendersBefore);
  });
});
