import { makeAutoObservable, runInAction } from 'mobx';

import type { BooksRepository } from '@/features/books/Books.repository';

const STATUS_TEXT = {
  loading: 'Loading books…',
  ready: '',
  error: 'Could not load books',
} as const;

type Status = keyof typeof STATUS_TEXT;

export const createBooksListController = (booksRepository: BooksRepository) => {
  const controller = makeAutoObservable(
    {
      status: 'loading' as Status,

      get books() {
        return booksRepository.allBooks;
      },

      get statusText() {
        return STATUS_TEXT[controller.status];
      },

      async init() {
        controller.status = 'loading';
        try {
          await booksRepository.loadAllBooks();
          runInAction(() => {
            controller.status = 'ready';
          });
        } catch {
          runInAction(() => {
            controller.status = 'error';
          });
        }
      },
    },
    {},
    { autoBind: true },
  );
  return controller;
};

export type BooksListController = ReturnType<typeof createBooksListController>;
