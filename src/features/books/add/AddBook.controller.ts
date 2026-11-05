import { makeAutoObservable, runInAction } from 'mobx';

import type { BooksRepository } from '@/features/books/Books.repository';

export const createAddBookController = (
  booksRepository: Pick<BooksRepository, 'isAdding' | 'addBook'>,
) => {
  const controller = makeAutoObservable(
    {
      name: '',
      author: '',
      hasError: false,

      get isSubmitting() {
        return booksRepository.isAdding;
      },

      get isSubmitDisabled() {
        return controller.isSubmitting || !controller.name.trim() || !controller.author.trim();
      },

      get submitText() {
        return controller.isSubmitting ? 'Adding…' : 'Add';
      },

      get errorText() {
        return controller.hasError ? 'Could not add the book' : '';
      },

      setName(name: string) {
        controller.name = name;
        controller.hasError = false;
      },

      setAuthor(author: string) {
        controller.author = author;
        controller.hasError = false;
      },

      async submit() {
        if (controller.isSubmitDisabled) return;
        controller.hasError = false;

        try {
          await booksRepository.addBook({
            name: controller.name.trim(),
            author: controller.author.trim(),
          });
          runInAction(() => {
            controller.name = '';
            controller.author = '';
          });
        } catch {
          runInAction(() => {
            controller.hasError = true;
          });
        }
      },
    },
    {},
    { autoBind: true },
  );
  return controller;
};

export type AddBookController = ReturnType<typeof createAddBookController>;
