import { describe, expect, it } from 'vitest';

import { createBooksRepository } from '@/features/books/Books.repository';
import { fakeGateway } from '@/shared/gateway/fakeGateway';

import { createBooksListController } from './BooksList.controller';

const ALL = [
  { id: 1, name: 'Dune', author: 'Frank Herbert' },
  { name: 'Mine', author: 'Me' },
];
const PRIVATE = [{ name: 'Mine', author: 'Me' }];

const setup = (gateway = fakeGateway({ get: { '/': ALL, '/private': PRIVATE } })) => {
  const repository = createBooksRepository(gateway);
  return { gateway, repository, controller: createBooksListController(repository) };
};

describe('BooksListController', () => {
  it('shows loading status until all books are loaded', async () => {
    const { controller } = setup();

    const loading = controller.init();
    expect(controller.filter).toBe('all');
    expect(controller.statusText).toBe('Loading books…');
    expect(controller.books).toEqual([]);

    await loading;
    expect(controller.statusText).toBe('');
    expect(controller.books).toEqual([
      { key: 'id:1', title: 'Frank Herbert: Dune' },
      { key: 'idx:1', title: 'Me: Mine' },
    ]);
  });

  it('offers two filters and marks the selected one', async () => {
    const { controller } = setup();
    expect(controller.filterOptions).toEqual([
      { value: 'all', label: 'All books', isSelected: true },
      { value: 'private', label: 'Private books', isSelected: false },
    ]);

    await controller.setFilter('private');
    expect(controller.filterOptions.map((option) => option.isSelected)).toEqual([false, true]);
  });

  it('switches between all and private books', async () => {
    const { gateway, controller } = setup();
    await controller.init();

    await controller.setFilter('private');
    expect(gateway.get).toHaveBeenLastCalledWith('/private');
    expect(controller.filter).toBe('private');
    expect(controller.books).toEqual([{ key: 'idx:0', title: 'Me: Mine' }]);

    await controller.setFilter('all');
    expect(controller.books).toHaveLength(2);
  });

  it('says so when the selected list is empty', async () => {
    const { controller } = setup(fakeGateway({ get: { '/': ALL, '/private': [] } }));

    await controller.setFilter('private');

    expect(controller.statusText).toBe('No books yet');
  });

  it('keeps the current books but marks the list busy while a book is being added', async () => {
    const { repository, controller } = setup();
    await controller.init();
    expect(controller.isBusy).toBe(false);

    const adding = repository.addBook({ name: 'Mine', author: 'Me' });
    expect(controller.isBusy).toBe(true);
    expect(controller.statusText).toBe('Updating list…');
    expect(controller.books).toHaveLength(2);

    await adding;
    expect(controller.isBusy).toBe(false);
    expect(controller.statusText).toBe('');
  });

  it('keeps showing already loaded books while they are reloaded', async () => {
    const { controller } = setup();
    await controller.init();
    await controller.setFilter('private');

    const reloading = controller.setFilter('all');
    expect(controller.isBusy).toBe(true);
    expect(controller.statusText).toBe('Updating list…');
    expect(controller.books).toHaveLength(2);

    await reloading;
    expect(controller.isBusy).toBe(false);
  });

  it('shows error status when loading fails', async () => {
    const { gateway, controller } = setup();
    gateway.get.mockRejectedValue(new Error('HTTP 500 for /'));

    await controller.init();

    expect(controller.statusText).toBe('Could not load books');
    expect(controller.books).toEqual([]);
  });

  it('clears the error status once a book is added and lists are reloaded', async () => {
    const { gateway, repository, controller } = setup();
    gateway.get.mockRejectedValueOnce(new Error('HTTP 502 for /'));
    await controller.init();

    await repository.addBook({ name: 'Mine', author: 'Me' });

    expect(controller.books).toHaveLength(2);
    expect(controller.statusText).toBe('');
  });
});
