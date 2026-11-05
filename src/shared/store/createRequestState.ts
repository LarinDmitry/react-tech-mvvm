import { makeAutoObservable, runInAction } from 'mobx';

export type RequestStatus = 'loading' | 'ready' | 'error';

export const createRequestState = () => {
  const state = makeAutoObservable(
    {
      status: 'loading' as RequestStatus,

      async run(request: () => Promise<unknown>) {
        state.status = 'loading';
        try {
          await request();
          runInAction(() => {
            state.status = 'ready';
          });
        } catch {
          runInAction(() => {
            state.status = 'error';
          });
        }
      },
    },
    {},
    { autoBind: true },
  );
  return state;
};
