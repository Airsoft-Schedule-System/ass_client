// 앞뒤 아이콘을 지원하는 브랜드 공통 버튼 컴포넌트

import type { ComponentPropsWithRef, ReactNode } from 'react';

export type ButtonProps = ComponentPropsWithRef<'button'> & {
  leadingIcon?: ReactNode; // 버튼 문구 앞에 표시할 아이콘
  trailingIcon?: ReactNode; // 버튼 문구 뒤에 표시할 아이콘
  variant?: 'primary' | 'secondary'; // 버튼의 강조 수준
};

const variantClassNames = {
  primary:
    'bg-[var(--color-app-brand)] text-[var(--color-app-background)] shadow-[0_10px_24px_var(--color-app-shadow)]',
  secondary:
    'border border-[var(--color-app-border)] bg-[var(--color-app-surface)] text-[var(--color-app-foreground)]',
};

export function Button({
  children,
  className = '',
  leadingIcon,
  trailingIcon,
  type = 'button',
  variant = 'primary',
  ...buttonProps
}: ButtonProps) {
  return (
    <button
      {...buttonProps}
      className={`flex h-14 w-full items-center justify-center gap-2.5 rounded-lg px-4 text-sm font-bold transition-opacity focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-app-brand)] enabled:cursor-pointer enabled:hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 ${variantClassNames[variant]} ${className}`}
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
