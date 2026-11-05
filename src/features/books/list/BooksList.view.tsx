import { observer } from 'mobx-react-lite';

import styles from './BooksList.module.css';
import { useBooksList } from './useBooksList';

export const BooksList = observer(function BooksList() {
  const vm = useBooksList();

  return (
    <section>
      <p className={styles.status}>{vm.statusText}</p>
      <ul className={styles.list}>
        {vm.books.map((book) => (
          <li key={book.key}>
            {book.author}: {book.name}
          </li>
        ))}
      </ul>
    </section>
  );
});
