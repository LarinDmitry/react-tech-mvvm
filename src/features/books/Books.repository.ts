import { makeAutoObservable, runInAction } from 'mobx';

import type { HttpGateway } from '../../shared/gateway/HttpGateway';
import type { Book, BookDto, NewBook, StatusDto } from './Book.types';

export const toBook = (dto: BookDto, index: number): Book => ({
  key: dto.id === undefined ? `idx:${index}` : `id:${dto.id}`,
  name: dto.name,
  author: dto.author,
});

export const createBooksRepository = (gateway: HttpGateway) => {
  const repository = makeAutoObservable(
    {
      allBooks: [] as Book[],

      async loadAllBooks() {
        const dtos = await gateway.get<BookDto[]>('/');
        runInAction(() => {
          repository.allBooks = dtos.map(toBook);
        });
      },

      async addBook({ name, author }: NewBook) {
        const result = await gateway.post<StatusDto>('/', { name, author });
        return result.status === 'ok';
      },
    },
    {},
    { autoBind: true },
  );
  return repository;
};

export type BooksRepository = ReturnType<typeof createBooksRepository>;
