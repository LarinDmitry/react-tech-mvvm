import { describe, expect, it } from 'vitest';

import { fakeGateway } from '@/shared/gateway/fakeGateway';
import { createBooksRepository } from './Books.repository';

describe('BooksRepository', () => {
  it('loads all books from "/" and maps DTOs to books with stable keys', async () => {
    const gateway = fakeGateway([
      { id: 111, name: 'Wind in the willows', ownerId: 'someone', author: 'Kenneth Graeme' },
      { name: 'New Book', author: 'New Author' },
    ]);
    const repository = createBooksRepository(gateway);

    await repository.loadAllBooks();

    expect(gateway.get).toHaveBeenCalledWith('/');
    expect(repository.allBooks).toEqual([
      { key: 'id:111', name: 'Wind in the willows', author: 'Kenneth Graeme' },
      { key: 'idx:1', name: 'New Book', author: 'New Author' },
    ]);
  });

  it('starts with an empty list', () => {
    expect(createBooksRepository(fakeGateway([])).allBooks).toEqual([]);
  });

  it('adds a book by POSTing name and author to "/" and reloads the list', async () => {
    const gateway = fakeGateway([{ name: 'N', author: 'A' }]);
    gateway.post.mockResolvedValue({ status: 'ok' });
    const repository = createBooksRepository(gateway);

    await expect(repository.addBook({ name: 'N', author: 'A' })).resolves.toBe(true);
    expect(gateway.post).toHaveBeenCalledWith('/', { name: 'N', author: 'A' });
    expect(repository.allBooks).toEqual([{ key: 'idx:0', name: 'N', author: 'A' }]);
  });

  it('reports failure and does not reload when the API does not answer "ok"', async () => {
    const gateway = fakeGateway({ status: 'error' });
    const repository = createBooksRepository(gateway);

    await expect(repository.addBook({ name: 'N', author: 'A' })).resolves.toBe(false);
    expect(gateway.get).not.toHaveBeenCalled();
  });
});
