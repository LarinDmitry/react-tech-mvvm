import { observer } from 'mobx-react-lite';

import { SegmentedControl } from '@/shared/ui/SegmentedControl';

import styles from './BooksList.module.css';
import { useBooksList } from './useBooksList';

export const BooksList = observer(function BooksList() {
  const { filterOptions, statusText, isRetryHidden, isBusy, books, setFilter, reload } =
    useBooksList();

  return (
    <section>
      <SegmentedControl label="Books filter" options={filterOptions} onChange={setFilter} />
      <p className={styles.status} role="status">
        {statusText}
      </p>
      <button type="button" hidden={isRetryHidden} onClick={reload}>
        Retry
      </button>
      <ul className={styles.list} aria-busy={isBusy}>
        {books.map(({ key, title }) => (
          <li key={key}>{title}</li>
        ))}
      </ul>
    </section>
  );
});
