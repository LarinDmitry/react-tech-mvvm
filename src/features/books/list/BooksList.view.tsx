import { observer } from 'mobx-react-lite';

import { SegmentedControl } from '@/shared/ui/SegmentedControl';

import styles from './BooksList.module.css';
import { useBooksList } from './useBooksList';

export const BooksList = observer(function BooksList() {
  const vm = useBooksList();

  return (
    <section>
      <SegmentedControl label="Books filter" options={vm.filterOptions} onChange={vm.setFilter} />
      <p className={styles.status} role="status">
        {vm.statusText}
      </p>
      <ul className={styles.list} aria-busy={vm.isBusy}>
        {vm.books.map((book) => (
          <li key={book.key}>{book.title}</li>
        ))}
      </ul>
    </section>
  );
});
