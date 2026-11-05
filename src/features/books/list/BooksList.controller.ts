import { makeAutoObservable, runInAction } from 'mobx';

import type { BooksRepository } from '@/features/books/Books.repository';
import type { TabOption } from '@/shared/ui/Tabs';

export type BooksFilter = 'all' | 'private';

const FILTER_OPTIONS: readonly TabOption<BooksFilter>[] = [
  { value: 'all', label: 'All books' },
  { value: 'private', label: 'Private books' },
];

type Status = 'loading' | 'ready' | 'error';

export const createBooksListController = (booksRepository: BooksRepository) => {
  const loaders = {
    all: booksRepository.loadAllBooks,
    private: booksRepository.loadPrivateBooks,
  };

  const controller = makeAutoObservable(
    {
      filterOptions: FILTER_OPTIONS,
      filter: 'all' as BooksFilter,
      status: 'loading' as Status,

      get books() {
        return controller.filter === 'all'
          ? booksRepository.allBooks
          : booksRepository.privateBooks;
      },

      get statusText() {
        if (controller.status === 'loading') return 'Loading books…';
        if (controller.status === 'error') return 'Could not load books';
        return controller.books.length ? '' : 'No books yet';
      },

      init() {
        return controller.load();
      },

      setFilter(filter: BooksFilter) {
        controller.filter = filter;
        return controller.load();
      },

      async load() {
        controller.status = 'loading';
        try {
          await loaders[controller.filter]();
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
    { filterOptions: false },
    { autoBind: true },
  );
  return controller;
};

export type BooksListController = ReturnType<typeof createBooksListController>;
