import { observer } from 'mobx-react-lite';
import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';

import './styles.css';
import { createContainer } from './container';

const { booksRepository } = createContainer();

const App = observer(() => {
  useEffect(() => {
    void booksRepository.loadAllBooks();
  }, []);

  return (
    <div>
      {booksRepository.allBooks.map((book) => (
        <div key={book.key}>
          {book.author}: {book.name}
        </div>
      ))}
      <button
        onClick={() => {
          alert('TBD');
        }}
      >
        Add
      </button>
    </div>
  );
});

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Root element #root not found');

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
