import { describe, expect, it } from 'vitest';

import { ALL_BOOKS } from '@/test/books';
import { deferred } from '@/test/deferred';
import { fakeGateway } from '@/test/fakeGateway';

import { createBooksRepository } from './Books.repository';

describe('BooksRepository', () => {
  it('starts with empty lists', () => {
    const repository = createBooksRepository(fakeGateway());

    expect(repository.allBooks).toEqual([]);
    expect(repository.privateBooks).toEqual([]);
  });

  it('loads all books from "/", keyed by id or by position when there is no id', async () => {
    const gateway = fakeGateway();
    const repository = createBooksRepository(gateway);

    await repository.loadAllBooks();

    expect(gateway.get).toHaveBeenCalledWith('/');
    expect(repository.allBooks).toEqual([
      { key: 'id:1', name: 'Dune', author: 'Frank Herbert' },
      { key: 'idx:1', name: 'Mine', author: 'Me' },
    ]);
  });

  it('keeps the loaded books and reports an error when a reload fails', async () => {
    const gateway = fakeGateway();
    const repository = createBooksRepository(gateway);
    await repository.loadAllBooks();

    gateway.get.mockRejectedValue(new Error('HTTP 500 for /'));
    await repository.loadAllBooks();

    expect(repository.allBooksRequest.status).toBe('error');
    expect(repository.allBooks).toHaveLength(2);
  });

  it('loads private books from "/private"', async () => {
    const gateway = fakeGateway();
    const repository = createBooksRepository(gateway);

    await repository.loadPrivateBooks();

    expect(gateway.get).toHaveBeenCalledWith('/private');
    expect(repository.privateBooks).toEqual([{ key: 'idx:0', name: 'Mine', author: 'Me' }]);
  });

  it('adds a book by POSTing name and author to "/" and reloads both lists', async () => {
    const gateway = fakeGateway();
    const repository = createBooksRepository(gateway);

    await repository.addBook({ name: 'Mine', author: 'Me' });

    expect(gateway.post).toHaveBeenCalledWith('/', { name: 'Mine', author: 'Me' });
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
    const repository = createBooksRepository(fakeGateway());
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
    const slow = deferred<unknown>();
    const gateway = fakeGateway();
    gateway.get.mockReturnValueOnce(slow.promise);
    const repository = createBooksRepository(gateway);

    const slowLoad = repository.loadAllBooks();
    await repository.addBook({ name: 'Mine', author: 'Me' });

    slow.resolve(ALL_BOOKS.slice(0, 1));
    await slowLoad;

    expect(repository.allBooks).toHaveLength(2);
  });
});
