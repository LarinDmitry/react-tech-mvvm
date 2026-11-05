import { useEffect, useState } from 'react';

interface Lifecycle {
  init?: () => void;
  dispose?: () => void;
}

export const useController = <T extends Lifecycle>(create: () => T): T => {
  const [controller] = useState(create);

  useEffect(() => {
    controller.init?.();
    return () => controller.dispose?.();
  }, [controller]);

  return controller;
};
