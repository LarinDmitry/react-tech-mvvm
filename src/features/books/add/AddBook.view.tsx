import { observer } from 'mobx-react-lite';

import { Form } from '@/shared/ui/Form';
import { TextField } from '@/shared/ui/TextField';

import styles from './AddBook.module.css';
import { useAddBook } from './useAddBook';

export const AddBook = observer(function AddBook() {
  const {
    name,
    author,
    isSubmitting,
    isSubmitDisabled,
    submitText,
    errorText,
    setName,
    setAuthor,
    submit,
  } = useAddBook();

  return (
    <Form className={styles.form} onSubmit={submit}>
      <TextField label="Name" value={name} disabled={isSubmitting} onChange={setName} />
      <TextField label="Author" value={author} disabled={isSubmitting} onChange={setAuthor} />
      <button className={styles.submit} type="submit" disabled={isSubmitDisabled}>
        {submitText}
      </button>
      <p className={styles.error} role="alert">
        {errorText}
      </p>
    </Form>
  );
});
