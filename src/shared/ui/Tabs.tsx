import styles from './Tabs.module.css';

export interface TabOption<T extends string> {
  value: T;
  label: string;
}

interface TabsProps<T extends string> {
  options: readonly TabOption<T>[];
  value: T;
  onChange: (value: T) => void;
}

export const Tabs = <T extends string>({ options, value, onChange }: TabsProps<T>) => (
  <div className={styles.tabs} role="tablist">
    {options.map((option) => (
      <button
        key={option.value}
        className={styles.tab}
        type="button"
        role="tab"
        aria-selected={option.value === value}
        onClick={() => onChange(option.value)}
      >
        {option.label}
      </button>
    ))}
  </div>
);
