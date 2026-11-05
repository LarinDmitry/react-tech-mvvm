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
      { key: 'id:1', name: 'Dune', author: 'Frank Herbert' },
      { key: 'idx:1', name: 'Mine', author: 'Me' },
    ]);
  });

  it('offers two filters: all and private', () => {
    const { controller } = setup();

    expect(controller.filterOptions.map((option) => option.value)).toEqual(['all', 'private']);
  });

  it('switches between all and private books', async () => {
    const { gateway, controller } = setup();
    await controller.init();

    await controller.setFilter('private');
    expect(gateway.get).toHaveBeenLastCalledWith('/private');
    expect(controller.filter).toBe('private');
    expect(controller.books).toEqual([{ key: 'idx:0', name: 'Mine', author: 'Me' }]);

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

  it('shows error status when loading fails', async () => {
    const { gateway, controller } = setup();
    gateway.get.mockRejectedValue(new Error('HTTP 500 for /'));

    await controller.init();

    expect(controller.statusText).toBe('Could not load books');
    expect(controller.books).toEqual([]);
  });
});
