import { makeAutoObservable } from 'mobx';

import type { BooksRepository } from '@/features/books/Books.repository';

type PrivateBooks = Pick<
  BooksRepository,
  'privateBooks' | 'privateBooksRequest' | 'loadPrivateBooks'
>;

export const createHeaderController = (booksRepository: PrivateBooks) => {
  const controller = makeAutoObservable(
    {
      get counterText() {
        const request = booksRepository.privateBooksRequest;
        if (request.isLoaded) return String(booksRepository.privateBooks.length);
        return request.status === 'error' ? '—' : '…';
      },

      get title() {
        return `Your books: ${controller.counterText}`;
      },

      init() {
        return booksRepository.loadPrivateBooks();
      },
    },
    {},
    { autoBind: true },
  );
  return controller;
};

export type HeaderController = ReturnType<typeof createHeaderController>;
