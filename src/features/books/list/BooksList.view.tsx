import { observer } from 'mobx-react-lite';

import { Tabs } from '@/shared/ui/Tabs';

import styles from './BooksList.module.css';
import { useBooksList } from './useBooksList';

export const BooksList = observer(function BooksList() {
  const vm = useBooksList();

  return (
    <section>
      <Tabs options={vm.filterOptions} value={vm.filter} onChange={vm.setFilter} />
      <p className={styles.status}>{vm.statusText}</p>
      <ul className={styles.list} aria-busy={vm.isBusy}>
        {vm.books.map((book) => (
          <li key={book.key}>
            {book.author}: {book.name}
          </li>
        ))}
      </ul>
    </section>
  );
});
