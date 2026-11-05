import { useContainer } from '@/app/container';
import { useController } from '@/shared/hooks/useController';

import { createAddBookController } from './AddBook.controller';

export const useAddBook = () => {
  const { booksRepository } = useContainer();
  return useController(() => createAddBookController(booksRepository));
};
