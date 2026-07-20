import type { ComponentPropsWithRef, ReactNode } from 'react';

export type ButtonProps = ComponentPropsWithRef<'button'> & {
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
};

export function Button({
  children,
  className = '',
  leadingIcon,
  trailingIcon,
  type = 'button',
  ...buttonProps
}: ButtonProps) {
  return (
    <button
      {...buttonProps}
      className={`flex h-[54px] w-full items-center justify-center gap-2.5 rounded-lg bg-[var(--color-app-brand)] px-4 text-[15px] font-bold text-[var(--color-app-background)] shadow-[0_10px_24px_var(--color-app-shadow)] transition-opacity focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-app-brand)] enabled:cursor-pointer enabled:hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      type={type}
    >
      {leadingIcon ? (
        <span aria-hidden="true" className="flex size-5 shrink-0 items-center justify-center">
          {leadingIcon}
        </span>
      ) : null}

      <span>{children}</span>

      {trailingIcon ? (
        <span aria-hidden="true" className="flex size-5 shrink-0 items-center justify-center">
          {trailingIcon}
        </span>
      ) : null}
    </button>
  );
}
