import styles from './TextField.module.css';

interface TextFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

export const TextField = ({ label, value, onChange }: TextFieldProps) => (
  <label className={styles.field}>
    {label}
    <input
      className={styles.input}
      value={value}
      onChange={(event) => onChange(event.target.value)}
    />
  </label>
);
