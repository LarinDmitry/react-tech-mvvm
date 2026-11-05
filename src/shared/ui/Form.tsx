import type { ReactNode } from 'react';

interface FormProps {
  className?: string;
  onSubmit: () => void;
  children: ReactNode;
}

export const Form = ({ className, onSubmit, children }: FormProps) => (
  <form
    className={className}
    onSubmit={(event) => {
      event.preventDefault();
      onSubmit();
    }}
  >
    {children}
  </form>
);
