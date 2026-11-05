import { observer } from 'mobx-react-lite';

import { Form } from '@/shared/ui/Form';
import { TextField } from '@/shared/ui/TextField';

import styles from './AddBook.module.css';
import { useAddBook } from './useAddBook';

export const AddBook = observer(function AddBook() {
  const vm = useAddBook();

  return (
    <Form className={styles.form} onSubmit={vm.submit}>
      <TextField label="Name" value={vm.name} onChange={vm.setName} />
      <TextField label="Author" value={vm.author} onChange={vm.setAuthor} />
      <button className={styles.submit} type="submit" disabled={vm.isSubmitDisabled}>
        {vm.submitText}
      </button>
      <p className={styles.error}>{vm.errorText}</p>
    </Form>
  );
});
