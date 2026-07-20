import type { ComponentPropsWithRef, ReactNode } from 'react';

const variantClassNames = {
  brand:
    'h-[54px] gap-2.5 rounded-lg bg-[var(--color-app-brand)] text-[15px] font-bold text-[var(--color-app-on-brand)] shadow-[0_10px_24px_var(--color-app-brand-shadow)]',
  social:
    'h-11 gap-3 rounded-sm border border-[var(--color-google-border)] bg-[var(--color-google-background)] text-sm font-medium text-[var(--color-google-foreground)]',
} as const;

export type ButtonProps = ComponentPropsWithRef<'button'> & {
  variant?: keyof typeof variantClassNames;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
};

export function Button({
  children,
  className = '',
  leadingIcon,
  trailingIcon,
  type = 'button',
  variant = 'brand',
  ...buttonProps
}: ButtonProps) {
  return (
    <button
      {...buttonProps}
      className={`flex w-full items-center justify-center px-4 transition-opacity focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-app-brand)] enabled:cursor-pointer enabled:hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 ${variantClassNames[variant]} ${className}`}
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
