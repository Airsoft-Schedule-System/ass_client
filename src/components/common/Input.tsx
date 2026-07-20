import { useId } from 'react';
import type { ComponentPropsWithRef, ReactNode } from 'react';

export type InputProps = Omit<ComponentPropsWithRef<'input'>, 'size'> & {
  label: string;
  leadingIcon?: ReactNode;
  trailingElement?: ReactNode;
};

export function Input({
  id,
  label,
  leadingIcon,
  trailingElement,
  className = '',
  ref,
  ...inputProps
}: InputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  return (
    <div className="flex w-full flex-col gap-2">
      <label
        className="text-[13px] leading-4 font-semibold text-[var(--color-app-foreground)]"
        htmlFor={inputId}
      >
        {label}
      </label>

      <div className="flex h-[54px] w-full items-center gap-3 rounded-lg border border-[var(--color-app-border)] bg-[var(--color-app-surface)] px-4 transition-colors focus-within:border-[var(--color-app-brand)]">
        {leadingIcon ? (
          <span
            aria-hidden="true"
            className="flex size-5 shrink-0 items-center justify-center text-[var(--color-app-muted)]"
          >
            {leadingIcon}
          </span>
        ) : null}

        <input
          {...inputProps}
          className={`min-w-0 flex-1 bg-transparent text-sm text-[var(--color-app-foreground)] outline-none placeholder:text-[var(--color-app-muted)] disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
          id={inputId}
          ref={ref}
        />

        {trailingElement ? (
          <span className="flex size-5 shrink-0 items-center justify-center text-[var(--color-app-muted)]">
            {trailingElement}
          </span>
        ) : null}
      </div>
    </div>
  );
}
