// 상태 문구를 의미별 색상으로 표시하는 공통 배지

import type { ReactNode } from 'react';

export type StatusBadgeTone = 'brand' | 'danger' | 'neutral' | 'success' | 'warning';

type StatusBadgeProps = {
  children: ReactNode; // 배지에 표시할 상태 문구
  tone?: StatusBadgeTone; // 상태 의미에 맞는 색상 종류
};

const toneClassNames: Record<StatusBadgeTone, string> = {
  brand:
    'bg-[color-mix(in_srgb,var(--color-app-brand)_14%,transparent)] text-[var(--color-app-brand)]',
  danger: 'bg-red-500/10 text-red-400',
  neutral: 'bg-white/5 text-[var(--color-app-muted)]',
  success: 'bg-emerald-400/10 text-emerald-400',
  warning: 'bg-amber-400/10 text-amber-400',
};

export function StatusBadge({ children, tone = 'neutral' }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex h-6 shrink-0 items-center rounded-full px-2.5 text-xs font-semibold ${toneClassNames[tone]}`}
    >
      {children}
    </span>
  );
}
