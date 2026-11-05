import { makeAutoObservable, runInAction } from 'mobx';

export type RequestStatus = 'loading' | 'ready' | 'error';

export const createRequestState = () => {
  let lastRun = 0;

  const state = makeAutoObservable(
    {
      status: 'loading' as RequestStatus,
      isLoaded: false,

      async run<T>(request: () => Promise<T>, apply: (result: T) => void) {
        const run = ++lastRun;
        state.status = 'loading';
        try {
          const result = await request();
          if (run !== lastRun) return;
          runInAction(() => {
            apply(result);
            state.status = 'ready';
            state.isLoaded = true;
          });
        } catch {
          if (run !== lastRun) return;
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

export type RequestState = ReturnType<typeof createRequestState>;
