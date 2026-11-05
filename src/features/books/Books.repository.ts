import { makeAutoObservable, runInAction } from 'mobx';

import type { HttpGateway } from '@/shared/gateway/HttpGateway';

import type { Book, BookDto, NewBook, StatusDto } from './Book.types';

export const toBook = (dto: BookDto, index: number): Book => ({
  key: dto.id === undefined ? `idx:${index}` : `id:${dto.id}`,
  name: dto.name,
  author: dto.author,
});

export const createBooksRepository = (gateway: HttpGateway) => {
  const fetchBooks = async (path: string) => (await gateway.get<BookDto[]>(path)).map(toBook);

  const repository = makeAutoObservable(
    {
      allBooks: [] as Book[],
      privateBooks: [] as Book[],

      async loadAllBooks() {
        const books = await fetchBooks('/');
        runInAction(() => {
          repository.allBooks = books;
        });
      },

      async loadPrivateBooks() {
        const books = await fetchBooks('/private');
        runInAction(() => {
          repository.privateBooks = books;
        });
      },

      async addBook({ name, author }: NewBook) {
        const result = await gateway.post<StatusDto>('/', { name, author });
        if (result.status !== 'ok') return false;

        const [allBooks, privateBooks] = await Promise.all([
          fetchBooks('/'),
          fetchBooks('/private'),
        ]);
        runInAction(() => {
          repository.allBooks = allBooks;
          repository.privateBooks = privateBooks;
        });
        return true;
      },
    },
    {},
    { autoBind: true },
  );
  return repository;
};

export type BooksRepository = ReturnType<typeof createBooksRepository>;
