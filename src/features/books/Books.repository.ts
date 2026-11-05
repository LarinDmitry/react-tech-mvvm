import { makeAutoObservable, runInAction } from 'mobx';

import type { HttpGateway } from '@/shared/gateway/HttpGateway';
import { createRequestState } from '@/shared/store/createRequestState';

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
      allBooksRequest: createRequestState(),
      privateBooksRequest: createRequestState(),
      isAdding: false,

      loadAllBooks() {
        return repository.allBooksRequest.run(
          () => fetchBooks('/'),
          (books) => {
            repository.allBooks = books;
          },
        );
      },

      loadPrivateBooks() {
        return repository.privateBooksRequest.run(
          () => fetchBooks('/private'),
          (books) => {
            repository.privateBooks = books;
          },
        );
      },

      async addBook({ name, author }: NewBook) {
        repository.isAdding = true;
        try {
          const result = await gateway.post<StatusDto>('/', { name, author });
          if (result.status !== 'ok') throw new Error(`Book was not added: ${result.status}`);

          // book is already saved here, so if the reload fails it's a list error, not an add error
          await Promise.all([repository.loadAllBooks(), repository.loadPrivateBooks()]);
        } finally {
          runInAction(() => {
            repository.isAdding = false;
          });
        }
      },
    },
    { allBooksRequest: false, privateBooksRequest: false },
    { autoBind: true },
  );
  return repository;
};

export type BooksRepository = ReturnType<typeof createBooksRepository>;
