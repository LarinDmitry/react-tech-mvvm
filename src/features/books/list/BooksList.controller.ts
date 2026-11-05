import { makeAutoObservable } from 'mobx';

import type { BooksRepository } from '@/features/books/Books.repository';

export type BooksFilter = 'all' | 'private';

const FILTERS: readonly { value: BooksFilter; label: string }[] = [
  { value: 'all', label: 'All books' },
  { value: 'private', label: 'Private books' },
];

export const createBooksListController = (booksRepository: BooksRepository) => {
  const sources = {
    all: {
      get books() {
        return booksRepository.allBooks;
      },
      request: booksRepository.allBooksRequest,
      load: booksRepository.loadAllBooks,
    },
    private: {
      get books() {
        return booksRepository.privateBooks;
      },
      request: booksRepository.privateBooksRequest,
      load: booksRepository.loadPrivateBooks,
    },
  };

  const controller = makeAutoObservable(
    {
      filter: 'all' as BooksFilter,

      get filterOptions() {
        return FILTERS.map((option) => ({
          ...option,
          isSelected: option.value === controller.filter,
        }));
      },

      get books() {
        return sources[controller.filter].books.map((book) => ({
          key: book.key,
          title: `${book.author}: ${book.name}`,
        }));
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
    {},
    { autoBind: true },
  );
  return controller;
};

export type BooksListController = ReturnType<typeof createBooksListController>;
