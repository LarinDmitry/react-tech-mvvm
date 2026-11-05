import { makeAutoObservable } from 'mobx';

import type { BooksRepository } from '@/features/books/Books.repository';
import type { TabOption } from '@/shared/ui/Tabs';

export type BooksFilter = 'all' | 'private';

const FILTER_OPTIONS: readonly TabOption<BooksFilter>[] = [
  { value: 'all', label: 'All books' },
  { value: 'private', label: 'Private books' },
];

export const createBooksListController = (booksRepository: BooksRepository) => {
  const sources = {
    all: {
      books: () => booksRepository.allBooks,
      request: booksRepository.allBooksRequest,
      load: booksRepository.loadAllBooks,
    },
    private: {
      books: () => booksRepository.privateBooks,
      request: booksRepository.privateBooksRequest,
      load: booksRepository.loadPrivateBooks,
    },
  };

  const controller = makeAutoObservable(
    {
      filterOptions: FILTER_OPTIONS,
      filter: 'all' as BooksFilter,

      get books() {
        return sources[controller.filter].books();
      },

      get isBusy() {
        return sources[controller.filter].request.status === 'loading' || booksRepository.isAdding;
      },

      get statusText() {
        const { request } = sources[controller.filter];
        if (request.status === 'error') return 'Could not load books';
        if (!request.isLoaded) return 'Loading books…';
        if (controller.isBusy) return 'Updating list…';
        return controller.books.length ? '' : 'No books yet';
      },

      init() {
        return sources[controller.filter].load();
      },

      setFilter(filter: BooksFilter) {
        controller.filter = filter;
        return sources[filter].load();
      },
    },
    { filterOptions: false },
    { autoBind: true },
  );
  return controller;
};

export type BooksListController = ReturnType<typeof createBooksListController>;
