// 상태 문구를 의미별 색상으로 표시하는 공통 배지

import type { ReactNode } from 'react';

export type StatusBadgeTone = 'brand' | 'danger' | 'neutral' | 'success' | 'warning';

type StatusBadgeProps = {
  children: ReactNode; // 배지에 표시할 상태 문구
  tone?: StatusBadgeTone; // 상태 의미에 맞는 색상 종류
};

const toneClassNames: Record<StatusBadgeTone, string> = {
  brand: 'bg-[var(--color-app-brand-subtle)] text-[var(--color-app-brand)]',
  danger: 'bg-[var(--color-app-danger-subtle)] text-[var(--color-app-danger)]',
  neutral: 'bg-[var(--color-app-muted-subtle)] text-[var(--color-app-muted)]',
  success: 'bg-[var(--color-app-success-subtle)] text-[var(--color-app-success)]',
  warning: 'bg-[var(--color-app-warning-subtle)] text-[var(--color-app-warning)]',
};

export function StatusBadge({ children, tone = 'neutral' }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex h-6 shrink-0 items-center rounded-sm px-[9px] text-[10px] font-bold ${toneClassNames[tone]}`}
    >
      {children}
    </span>
  );
}
