// @vitest-environment jsdom
import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import { Profiler } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { BooksList } from '@/features/books/list/BooksList.view';
import { Header } from '@/features/header/Header.view';
import { ALL_BOOKS, PRIVATE_BOOKS } from '@/test/books';
import { fakeGateway } from '@/test/fakeGateway';
import { renderWithContainer } from '@/test/renderWithContainer';

import { App } from './App';

afterEach(cleanup);

describe('Adding a book', () => {
  it('shows progress, then the new book in the list and in the counter', async () => {
    const gateway = fakeGateway();
    const added = { name: 'Solaris', author: 'Stanislaw Lem' };
    gateway.post.mockImplementation(async () => {
      gateway.get.mockImplementation((path: string) =>
        Promise.resolve(path === '/private' ? [...PRIVATE_BOOKS, added] : [...ALL_BOOKS, added]),
      );
      return { status: 'ok' };
    });
    const onRender = vi.fn();
    renderWithContainer(
      <Profiler id="app" onRender={onRender}>
        <App />
      </Profiler>,
      gateway,
    );
    await screen.findByText('Your books: 1');
    await screen.findByText('Frank Herbert: Dune');

    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Solaris' } });
    fireEvent.change(screen.getByLabelText('Author'), { target: { value: 'Stanislaw Lem' } });
    const rendersBefore = onRender.mock.calls.length;
    fireEvent.click(screen.getByRole('button', { name: 'Add' }));

    expect(screen.getByRole('button', { name: 'Adding…' })).toBeTruthy();
    expect(await screen.findByText('Stanislaw Lem: Solaris')).toBeTruthy();
    expect(await screen.findByText('Your books: 2')).toBeTruthy();
    expect(screen.getByLabelText<HTMLInputElement>('Name').value).toBe('');
    expect(screen.getByLabelText<HTMLInputElement>('Author').value).toBe('');
    // start, / loaded, /private loaded, done
    expect(onRender.mock.calls.length - rendersBefore).toBe(4);
  });
});

describe('App views', () => {
  it('renders the list once on mount and once more when books arrive', async () => {
    const onRender = vi.fn();
    renderWithContainer(
      <Profiler id="list" onRender={onRender}>
        <BooksList />
      </Profiler>,
      fakeGateway(),
    );

    expect(screen.getByText('Loading books…')).toBeTruthy();
    expect(await screen.findByText('Frank Herbert: Dune')).toBeTruthy();
    expect(onRender).toHaveBeenCalledTimes(2);
  });

  it('shows the private books counter in the header', async () => {
    renderWithContainer(<Header />, fakeGateway());

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
      fakeGateway(),
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
