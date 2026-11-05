import { AddBook } from '@/features/books/add/AddBook.view';
import { BooksList } from '@/features/books/list/BooksList.view';

import styles from './App.module.css';

export const App = () => (
  <main className={styles.app}>
    <BooksList />
    <AddBook />
  </main>
);
