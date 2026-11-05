import { describe, expect, it } from 'vitest';

import { createBooksRepository } from '@/features/books/Books.repository';
import { fakeGateway } from '@/shared/gateway/fakeGateway';

import { createHeaderController } from './Header.controller';

const PRIVATE = [
  { name: 'Mine', author: 'Me' },
  { name: 'Also mine', author: 'Me' },
];

const setup = (gateway = fakeGateway({ get: { '/': PRIVATE, '/private': PRIVATE } })) => {
  const repository = createBooksRepository(gateway);
  return { gateway, repository, controller: createHeaderController(repository) };
};

describe('HeaderController', () => {
  it('shows a placeholder until private books are loaded', async () => {
    const { gateway, controller } = setup();

    const loading = controller.init();
    expect(controller.title).toBe('Your books: …');

    await loading;
    expect(gateway.get).toHaveBeenCalledWith('/private');
    expect(controller.title).toBe('Your books: 2');
  });

  it('updates the counter after a book is added', async () => {
    const gateway = fakeGateway({ get: { '/': [], '/private': [] } });
    const { repository, controller } = setup(gateway);
    await controller.init();
    expect(controller.title).toBe('Your books: 0');

    gateway.get.mockImplementation((path: string) =>
      Promise.resolve(path === '/private' ? PRIVATE : []),
    );
    await repository.addBook({ name: 'Also mine', author: 'Me' });

    expect(controller.title).toBe('Your books: 2');
  });

  it('shows a dash when loading fails', async () => {
    const { gateway, controller } = setup();
    gateway.get.mockRejectedValue(new Error('HTTP 500 for /private'));

    await controller.init();

    expect(controller.title).toBe('Your books: —');
  });

  it('recovers from a failed first load after a book is added', async () => {
    const { gateway, repository, controller } = setup();
    gateway.get.mockRejectedValueOnce(new Error('HTTP 502 for /private'));
    await controller.init();
    expect(controller.title).toBe('Your books: —');

    await repository.addBook({ name: 'Mine', author: 'Me' });

    expect(controller.title).toBe('Your books: 2');
  });
});
