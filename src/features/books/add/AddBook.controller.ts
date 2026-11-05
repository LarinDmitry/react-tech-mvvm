import { makeAutoObservable, runInAction } from 'mobx';

import type { BooksRepository } from '@/features/books/Books.repository';

type Status = 'idle' | 'submitting' | 'error';

export const createAddBookController = (booksRepository: BooksRepository) => {
  const controller = makeAutoObservable(
    {
      name: '',
      author: '',
      status: 'idle' as Status,

      get isSubmitting() {
        return controller.status === 'submitting';
      },

      get isSubmitDisabled() {
        return controller.isSubmitting || !controller.name.trim() || !controller.author.trim();
      },

      get submitText() {
        return controller.isSubmitting ? 'Adding…' : 'Add';
      },

      get errorText() {
        return controller.status === 'error' ? 'Could not add the book' : '';
      },

      setName(name: string) {
        controller.name = name;
      },

      setAuthor(author: string) {
        controller.author = author;
      },

      async submit() {
        if (controller.isSubmitDisabled) return;
        controller.status = 'submitting';

        const added = await booksRepository
          .addBook({ name: controller.name.trim(), author: controller.author.trim() })
          .catch(() => false);

        runInAction(() => {
          if (!added) {
            controller.status = 'error';
            return;
          }
          controller.name = '';
          controller.author = '';
          controller.status = 'idle';
        });
      },
    },
    {},
    { autoBind: true },
  );
  return controller;
};

export type AddBookController = ReturnType<typeof createAddBookController>;
