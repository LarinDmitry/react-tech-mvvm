import { describe, expect, it } from 'vitest';

import { fakeGateway } from '@/shared/gateway/fakeGateway';
import { createBooksRepository } from '@/features/books/Books.repository';
import { createBooksListController } from './BooksList.controller';

const setup = (gateway = fakeGateway([{ id: 1, name: 'Book', author: 'Author' }])) =>
  createBooksListController(createBooksRepository(gateway));

describe('BooksListController', () => {
  it('shows loading status until books are loaded', async () => {
    const controller = setup();

    const loading = controller.init();
    expect(controller.statusText).toBe('Loading books…');
    expect(controller.books).toEqual([]);

    await loading;
    expect(controller.statusText).toBe('');
    expect(controller.books).toEqual([{ key: 'id:1', name: 'Book', author: 'Author' }]);
  });

  it('shows error status when loading fails', async () => {
    const gateway = fakeGateway(null);
    gateway.get.mockRejectedValue(new Error('HTTP 500 for /'));
    const controller = setup(gateway);

    await controller.init();

    expect(controller.statusText).toBe('Could not load books');
    expect(controller.books).toEqual([]);
  });
});
