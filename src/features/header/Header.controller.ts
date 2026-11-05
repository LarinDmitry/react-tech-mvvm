import { makeAutoObservable } from 'mobx';

import type { BooksRepository } from '@/features/books/Books.repository';
import { createRequestState } from '@/shared/store/createRequestState';

export const createHeaderController = (booksRepository: BooksRepository) => {
  const request = createRequestState();

  const controller = makeAutoObservable(
    {
      get counterText() {
        if (request.status === 'loading') return '…';
        if (request.status === 'error') return '—';
        return String(booksRepository.privateBooks.length);
      },

      get title() {
        return `Your books: ${controller.counterText}`;
      },

      init() {
        return request.run(booksRepository.loadPrivateBooks);
      },
    },
    {},
    { autoBind: true },
  );
  return controller;
};

export type HeaderController = ReturnType<typeof createHeaderController>;
