import { useContainer } from '@/app/container';
import { useController } from '@/shared/hooks/useController';

import { createHeaderController } from './Header.controller';

export const useHeader = () => {
  const { booksRepository } = useContainer();
  return useController(() => createHeaderController(booksRepository));
};
