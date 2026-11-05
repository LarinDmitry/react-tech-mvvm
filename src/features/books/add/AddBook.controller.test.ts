import { describe, expect, it } from 'vitest';

import { createBooksRepository } from '@/features/books/Books.repository';
import { fakeGateway } from '@/shared/gateway/fakeGateway';

import { createAddBookController } from './AddBook.controller';

const DUNE = [{ name: 'Dune', author: 'Frank Herbert' }];

const setup = (postResponse: unknown = { status: 'ok' }) => {
  const gateway = fakeGateway({ get: { '/': DUNE, '/private': DUNE }, post: postResponse });
  const repository = createBooksRepository(gateway);
  const controller = createAddBookController(repository);
  return { gateway, repository, controller };
};

const fillForm = (controller: ReturnType<typeof setup>['controller']) => {
  controller.setName('  Dune ');
  controller.setAuthor(' Frank Herbert  ');
};

describe('AddBookController', () => {
  it('disables submit until both fields are filled', () => {
    const { controller } = setup();
    expect(controller.isSubmitDisabled).toBe(true);

    controller.setName('Dune');
    controller.setAuthor('   ');
    expect(controller.isSubmitDisabled).toBe(true);

    controller.setAuthor('Frank Herbert');
    expect(controller.isSubmitDisabled).toBe(false);
  });

  it('posts trimmed values, refreshes the list and clears the form', async () => {
    const { gateway, repository, controller } = setup();
    fillForm(controller);

    const submitting = controller.submit();
    expect(controller.isSubmitDisabled).toBe(true);
    expect(controller.submitText).toBe('Adding…');
    await submitting;

    expect(gateway.post).toHaveBeenCalledWith('/', { name: 'Dune', author: 'Frank Herbert' });
    expect(repository.allBooks).toEqual([{ key: 'idx:0', name: 'Dune', author: 'Frank Herbert' }]);
    expect(controller.name).toBe('');
    expect(controller.author).toBe('');
    expect(controller.submitText).toBe('Add');
    expect(controller.errorText).toBe('');
  });

  it('keeps the values and shows an error when the API does not answer "ok"', async () => {
    const { controller } = setup({ status: 'error' });
    fillForm(controller);

    await controller.submit();

    expect(controller.errorText).toBe('Could not add the book');
    expect(controller.name).toBe('  Dune ');
    expect(controller.isSubmitDisabled).toBe(false);
  });

  it('shows an error when the request fails', async () => {
    const { gateway, controller } = setup();
    gateway.post.mockRejectedValue(new Error('HTTP 500 for /'));
    fillForm(controller);

    await controller.submit();

    expect(controller.errorText).toBe('Could not add the book');
  });

  it('does not post an incomplete form', async () => {
    const { gateway, controller } = setup();
    controller.setName('Dune');

    await controller.submit();

    expect(gateway.post).not.toHaveBeenCalled();
  });

  it('clears the error once a retry succeeds', async () => {
    const { gateway, controller } = setup();
    gateway.post.mockRejectedValueOnce(new Error('HTTP 500 for /'));
    fillForm(controller);
    await controller.submit();
    expect(controller.errorText).toBe('Could not add the book');

    await controller.submit();

    expect(controller.errorText).toBe('');
    expect(controller.name).toBe('');
  });

  it('clears the error when a field is edited', async () => {
    const { gateway, controller } = setup();
    gateway.post.mockRejectedValueOnce(new Error('HTTP 500 for /'));
    fillForm(controller);
    await controller.submit();

    controller.setName('Dune Messiah');

    expect(controller.errorText).toBe('');
  });

  it('ignores a second submit while the first one is in flight', async () => {
    const { gateway, controller } = setup();
    fillForm(controller);

    const first = controller.submit();
    expect(controller.isSubmitting).toBe(true);
    await controller.submit();
    await first;

    expect(gateway.post).toHaveBeenCalledTimes(1);
  });

  it('treats the book as added when only the reload after POST fails', async () => {
    const { gateway, controller } = setup();
    gateway.get.mockRejectedValue(new Error('HTTP 502 for /'));
    fillForm(controller);

    await controller.submit();

    expect(gateway.post).toHaveBeenCalledTimes(1);
    expect(controller.errorText).not.toBe('Could not add the book');
    expect(controller.name).toBe('');
  });
});
