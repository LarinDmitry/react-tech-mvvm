import { createContext, use } from 'react';

import { createBooksRepository } from '@/features/books/Books.repository';
import { getApiBase } from '@/shared/config';
import { createHttpGateway, type HttpGateway } from '@/shared/gateway/HttpGateway';

export const createContainer = (gateway: HttpGateway = createHttpGateway(getApiBase())) => ({
  booksRepository: createBooksRepository(gateway),
});

export type Container = ReturnType<typeof createContainer>;

export const ContainerContext = createContext<Container | null>(null);

export const useContainer = (): Container => {
  const container = use(ContainerContext);
  if (!container) throw new Error('ContainerContext is not provided');
  return container;
};
