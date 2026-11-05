import { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';

import './styles.css';
import booksRepository, { type BookDto } from './Books/Books.repository';

function App() {
  const [list, setList] = useState<BookDto[]>([]);

  useEffect(() => {
    async function load() {
      const books = await booksRepository.getBooks();
      setList(books);
    }
    void load();
  }, []);

  return (
    <div>
      {list.map((book, i) => (
        <div key={i}>
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
}

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Root element #root not found');

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
