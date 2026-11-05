import { useEffect, useState } from 'react';

interface Lifecycle {
  init?: () => void;
  dispose?: () => void;
}

export const useController = <T extends object>(create: () => T): T => {
  const [controller] = useState(create);

  useEffect(() => {
    const lifecycle: Lifecycle = controller;
    lifecycle.init?.();
    return () => lifecycle.dispose?.();
  }, [controller]);

  return controller;
};
