import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import './styles.css';
import { App } from './App';
import { ContainerContext, createContainer } from './container';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Root element #root not found');

createRoot(rootElement).render(
  <StrictMode>
    <ContainerContext value={createContainer()}>
      <App />
    </ContainerContext>
  </StrictMode>,
);
