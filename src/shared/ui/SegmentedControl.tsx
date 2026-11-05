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
    {options.map(({ value, label: optionLabel, isSelected }) => (
      <button
        key={value}
        className={styles.option}
        type="button"
        aria-pressed={isSelected}
        onClick={() => onChange(value)}
      >
        {optionLabel}
      </button>
    ))}
  </div>
);
