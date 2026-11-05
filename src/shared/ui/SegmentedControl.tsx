import styles from './SegmentedControl.module.css';

interface SegmentedControlProps<T extends string> {
  label: string;
  options: readonly { value: T; label: string; isSelected: boolean }[];
  onChange: (value: T) => void;
}

export const SegmentedControl = <T extends string>({
  label,
  options,
  onChange,
}: SegmentedControlProps<T>) => (
  <div className={styles.group} role="group" aria-label={label}>
    {options.map((option) => (
      <button
        key={option.value}
        className={styles.option}
        type="button"
        aria-pressed={option.isSelected}
        onClick={() => onChange(option.value)}
      >
        {option.label}
      </button>
    ))}
  </div>
);
