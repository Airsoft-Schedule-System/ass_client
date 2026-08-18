// 라벨과 앞 요소를 지원하는 공통 선택 컴포넌트

import { useId } from 'react';
import { ChevronDownIcon } from './icons/ChevronDownIcon';
import type { ComponentPropsWithRef, ReactNode } from 'react';

export type SelectProps = Omit<ComponentPropsWithRef<'select'>, 'size'> & {
  label: string; // 선택창 위에 표시할 라벨
  leadingIcon?: ReactNode; // 선택값 앞에 표시할 아이콘
  errorMessage?: string; // 선택창 아래에 표시할 검증 오류 문구
};

export function Select({
  id,
  label,
  leadingIcon,
  errorMessage,
  children,
  className = '',
  ref,
  'aria-describedby': ariaDescribedBy,
  'aria-invalid': ariaInvalid,
  ...selectProps
}: SelectProps) {
  const generatedId = useId();
  const selectId = id ?? generatedId;
  const errorId = `${selectId}-error`;
  const describedBy = errorMessage
    ? [ariaDescribedBy, errorId].filter(Boolean).join(' ')
    : ariaDescribedBy;

  return (
    <div className="flex w-full flex-col">
      <label
        className="mt-2 mb-1 p-1 text-xs font-semibold text-[var(--color-app-foreground)]"
        htmlFor={selectId}
      >
        {label}
      </label>

      <div
        className={`flex h-14 w-full items-center gap-3 rounded-lg border bg-[var(--color-app-surface)] px-4 transition-colors focus-within:border-[var(--color-app-brand)] ${errorMessage ? 'border-[var(--color-app-brand)]' : 'border-[var(--color-app-border)]'}`}
      >
        {leadingIcon ? (
          <span
            aria-hidden="true"
            className="flex size-5 shrink-0 items-center justify-center text-[var(--color-app-muted)]"
          >
            {leadingIcon}
          </span>
        ) : null}

        <select
          {...selectProps}
          aria-describedby={describedBy}
          aria-invalid={errorMessage ? true : ariaInvalid}
          className={`min-w-0 flex-1 cursor-pointer appearance-none bg-transparent text-sm text-[var(--color-app-foreground)] outline-none disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
          id={selectId}
          ref={ref}
        >
          {children}
        </select>

        <span
          aria-hidden="true"
          className="pointer-events-none flex size-5 shrink-0 items-center justify-center text-[var(--color-app-muted)]"
        >
          <ChevronDownIcon />
        </span>
      </div>

      {errorMessage ? (
        <p
          className="px-1 pt-1 text-xs font-semibold text-[var(--color-app-brand)]"
          id={errorId}
          role="alert"
        >
          {errorMessage}
        </p>
      ) : null}
    </div>
  );
}
