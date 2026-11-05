import { describe, expect, it } from 'vitest';

import { fakeGateway } from '@/shared/gateway/fakeGateway';

import { createBooksRepository } from './Books.repository';

const ALL = [
  { id: 111, name: 'Wind in the willows', ownerId: 'someone', author: 'Kenneth Graeme' },
  { name: 'New Book', author: 'New Author' },
];
const PRIVATE = [{ name: 'New Book', author: 'New Author' }];

describe('BooksRepository', () => {
  it('starts with empty lists', () => {
    const repository = createBooksRepository(fakeGateway());

    expect(repository.allBooks).toEqual([]);
    expect(repository.privateBooks).toEqual([]);
  });

  it('loads all books from "/" and maps DTOs to books with stable keys', async () => {
    const gateway = fakeGateway({ get: { '/': ALL } });
    const repository = createBooksRepository(gateway);

    await repository.loadAllBooks();

    expect(gateway.get).toHaveBeenCalledWith('/');
    expect(repository.allBooks).toEqual([
      { key: 'id:111', name: 'Wind in the willows', author: 'Kenneth Graeme' },
      { key: 'idx:1', name: 'New Book', author: 'New Author' },
    ]);
  });

  it('loads private books from "/private"', async () => {
    const gateway = fakeGateway({ get: { '/private': PRIVATE } });
    const repository = createBooksRepository(gateway);

    await repository.loadPrivateBooks();

    expect(gateway.get).toHaveBeenCalledWith('/private');
    expect(repository.privateBooks).toEqual([
      { key: 'idx:0', name: 'New Book', author: 'New Author' },
    ]);
  });

  it('adds a book by POSTing name and author to "/" and reloads both lists', async () => {
    const gateway = fakeGateway({ get: { '/': ALL, '/private': PRIVATE } });
    const repository = createBooksRepository(gateway);

    await expect(repository.addBook({ name: 'New Book', author: 'New Author' })).resolves.toBe(
      true,
    );

    expect(gateway.post).toHaveBeenCalledWith('/', { name: 'New Book', author: 'New Author' });
    expect(repository.allBooks).toHaveLength(2);
    expect(repository.privateBooks).toHaveLength(1);
  });

  it('reports failure and does not reload when the API does not answer "ok"', async () => {
    const gateway = fakeGateway({ post: { status: 'error' } });
    const repository = createBooksRepository(gateway);

    await expect(repository.addBook({ name: 'N', author: 'A' })).resolves.toBe(false);
    expect(gateway.get).not.toHaveBeenCalled();
  });
});
