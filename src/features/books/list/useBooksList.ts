import { useContainer } from '@/app/container';
import { useController } from '@/shared/hooks/useController';

import { createBooksListController } from './BooksList.controller';

export const useBooksList = () => {
  const { booksRepository } = useContainer();
  return useController(() => createBooksListController(booksRepository));
};
