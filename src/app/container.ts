import { createContext, use } from 'react';

import { createBooksRepository } from '@/features/books/Books.repository';
import { config } from '@/shared/config';
import { createHttpGateway } from '@/shared/gateway/HttpGateway';

export const createContainer = () => {
  const gateway = createHttpGateway(config.apiBase);
  return {
    booksRepository: createBooksRepository(gateway),
  };
};

export type Container = ReturnType<typeof createContainer>;

export const ContainerContext = createContext<Container | null>(null);

export const useContainer = (): Container => {
  const container = use(ContainerContext);
  if (!container) throw new Error('ContainerContext is not provided');
  return container;
};
