import { render } from '@testing-library/react';
import type { ReactNode } from 'react';

import { ContainerContext, createContainer } from '@/app/container';
import type { HttpGateway } from '@/shared/gateway/HttpGateway';

export const renderWithContainer = (ui: ReactNode, gateway: HttpGateway) =>
  render(<ContainerContext value={createContainer(gateway)}>{ui}</ContainerContext>);
