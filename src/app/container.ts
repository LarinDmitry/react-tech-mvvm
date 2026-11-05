import { createBooksRepository } from '../features/books/Books.repository';
import { config } from '../shared/config';
import { createHttpGateway } from '../shared/gateway/HttpGateway';

export const createContainer = () => {
  const gateway = createHttpGateway(config.apiBase);
  return {
    booksRepository: createBooksRepository(gateway),
  };
};

export type Container = ReturnType<typeof createContainer>;
