// 라벨과 앞뒤 요소를 지원하는 공통 입력 컴포넌트

import { useId } from 'react';
import type { ComponentPropsWithRef, ReactNode } from 'react';

export type InputProps = Omit<ComponentPropsWithRef<'input'>, 'size'> & {
  label: string; // 입력창 위에 표시할 라벨
  leadingIcon?: ReactNode; // 입력값 앞에 표시할 아이콘
  trailingElement?: ReactNode; // 입력값 뒤에 표시할 버튼이나 아이콘
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
    <div className="flex w-full flex-col">
      <label
        className="mt-2 mb-1 p-1 text-xs font-semibold text-[var(--color-app-foreground)]"
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
          <span className="flex shrink-0 items-center justify-center text-[var(--color-app-muted)]">
            {trailingElement}
          </span>
        ) : null}
      </div>
    </div>
  );
}
