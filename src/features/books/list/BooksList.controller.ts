import { makeAutoObservable } from 'mobx';

import type { BooksRepository } from '@/features/books/Books.repository';
import { createRequestState } from '@/shared/store/createRequestState';
import type { TabOption } from '@/shared/ui/Tabs';

export type BooksFilter = 'all' | 'private';

const FILTER_OPTIONS: readonly TabOption<BooksFilter>[] = [
  { value: 'all', label: 'All books' },
  { value: 'private', label: 'Private books' },
];

export const createBooksListController = (booksRepository: BooksRepository) => {
  const request = createRequestState();
  const loaders = {
    all: booksRepository.loadAllBooks,
    private: booksRepository.loadPrivateBooks,
  };

  const controller = makeAutoObservable(
    {
      filterOptions: FILTER_OPTIONS,
      filter: 'all' as BooksFilter,

      get books() {
        return controller.filter === 'all'
          ? booksRepository.allBooks
          : booksRepository.privateBooks;
      },

      get isBusy() {
        return request.status === 'loading' || booksRepository.isAdding;
      },

      get statusText() {
        if (request.status === 'loading') return 'Loading books…';
        if (request.status === 'error') return 'Could not load books';
        if (booksRepository.isAdding) return 'Updating list…';
        return controller.books.length ? '' : 'No books yet';
      },

      init() {
        return request.run(loaders[controller.filter]);
      },

      setFilter(filter: BooksFilter) {
        controller.filter = filter;
        return request.run(loaders[filter]);
      },
    },
    { filterOptions: false },
    { autoBind: true },
  );
  return controller;
};

export type BooksListController = ReturnType<typeof createBooksListController>;
