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

  it('keeps the loaded books and reports an error when a reload fails', async () => {
    const gateway = fakeGateway({ get: { '/': ALL } });
    const repository = createBooksRepository(gateway);
    await repository.loadAllBooks();

    gateway.get.mockRejectedValue(new Error('HTTP 500 for /'));
    await repository.loadAllBooks();

    expect(repository.allBooksRequest.status).toBe('error');
    expect(repository.allBooks).toHaveLength(2);
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

    await repository.addBook({ name: 'New Book', author: 'New Author' });

    expect(gateway.post).toHaveBeenCalledWith('/', { name: 'New Book', author: 'New Author' });
    expect(repository.allBooks).toHaveLength(2);
    expect(repository.privateBooks).toHaveLength(1);
  });

  it('throws and does not reload when the API does not answer "ok"', async () => {
    const gateway = fakeGateway({ post: { status: 'error' } });
    const repository = createBooksRepository(gateway);

    await expect(repository.addBook({ name: 'N', author: 'A' })).rejects.toThrow();
    expect(gateway.get).not.toHaveBeenCalled();
  });

  it('is adding from the POST until both lists are reloaded', async () => {
    const repository = createBooksRepository(
      fakeGateway({ get: { '/': ALL, '/private': PRIVATE } }),
    );
    expect(repository.isAdding).toBe(false);

    const adding = repository.addBook({ name: 'N', author: 'A' });
    expect(repository.isAdding).toBe(true);

    await adding;
    expect(repository.isAdding).toBe(false);
    expect(repository.allBooks).toHaveLength(2);
  });

  it('stops adding when the request fails', async () => {
    const gateway = fakeGateway();
    gateway.post.mockRejectedValue(new Error('HTTP 500 for /'));
    const repository = createBooksRepository(gateway);

    await expect(repository.addBook({ name: 'N', author: 'A' })).rejects.toThrow();
    expect(repository.isAdding).toBe(false);
  });

  it('ignores a slow load that resolves after the reload from addBook', async () => {
    let resolveSlow: (books: unknown) => void = () => undefined;
    const gateway = fakeGateway({ get: { '/private': PRIVATE } });
    gateway.get.mockImplementationOnce(() => new Promise((resolve) => (resolveSlow = resolve)));
    const repository = createBooksRepository(gateway);

    const slowLoad = repository.loadAllBooks();
    gateway.get.mockImplementation((path: string) =>
      Promise.resolve(path === '/private' ? PRIVATE : ALL),
    );
    await repository.addBook({ name: 'New Book', author: 'New Author' });

    resolveSlow([ALL[0]]);
    await slowLoad;

    expect(repository.allBooks).toHaveLength(2);
  });
});
