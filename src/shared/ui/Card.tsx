// Pen의 ASS 카드 표면을 제공하는 범용 컨테이너

import type { ComponentPropsWithRef } from 'react';

type CardProps = ComponentPropsWithRef<'div'>;

export function Card({ className = '', ...props }: CardProps) {
  return (
    <div
      {...props}
      className={`rounded-md border border-[var(--color-app-border)] bg-[var(--color-app-surface)] ${className}`}
    />
  );
}
