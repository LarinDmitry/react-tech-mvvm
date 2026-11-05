import { AddBook } from '@/features/books/add/AddBook.view';
import { BooksList } from '@/features/books/list/BooksList.view';
import { Header } from '@/features/header/Header.view';

import styles from './App.module.css';

export const App = () => (
  <>
    <Header />
    <main className={styles.app}>
      <BooksList />
      <AddBook />
    </main>
  </>
);
