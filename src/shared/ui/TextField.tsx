import styles from './TextField.module.css';

interface TextFieldProps {
  label: string;
  value: string;
  disabled?: boolean;
  onChange: (value: string) => void;
}

export const TextField = ({ label, value, disabled, onChange }: TextFieldProps) => (
  <label className={styles.field}>
    {label}
    <input
      className={styles.input}
      value={value}
      disabled={disabled}
      onChange={({ target: { value } }) => onChange(value)}
    />
  </label>
);
