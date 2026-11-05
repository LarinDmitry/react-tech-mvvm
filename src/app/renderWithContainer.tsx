import { render } from '@testing-library/react';
import type { ReactNode } from 'react';

import type { HttpGateway } from '@/shared/gateway/HttpGateway';

import { ContainerContext, createContainer } from './container';

export const renderWithContainer = (ui: ReactNode, gateway: HttpGateway) =>
  render(<ContainerContext value={createContainer(gateway)}>{ui}</ContainerContext>);
