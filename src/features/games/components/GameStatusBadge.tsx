// 게임 모집 상태와 사용자의 참가 상태를 일관된 배지로 표시

import type { ParticipationStatus } from '@/api/participations/participations';
import type { GameSessionStatus } from '@/api/sessions/sessions';

type GameStatus = GameSessionStatus | ParticipationStatus;

type GameStatusBadgeProps = {
  status: GameStatus; // 배지 문구와 색상을 결정할 게임 또는 참가 상태
};

const statusLabels: Record<GameStatus, string> = {
  recruiting: '모집 중',
  closed: '모집 마감',
  inProgress: '진행 중',
  completed: '진행 완료',
  cancelled: '취소',
  pendingApproval: '승인 대기',
  awaitingPayment: '입금 대기',
  confirmed: '참석 확정',
  attended: '출석 완료',
  rejected: '반려',
  refundRequested: '환불 요청',
};

// 상태 의미에 맞는 배지 색상 조합을 반환
function getStatusClassName(status: GameStatus) {
  if (status === 'recruiting' || status === 'awaitingPayment') {
    return 'bg-[color-mix(in_srgb,var(--color-app-brand)_14%,transparent)] text-[var(--color-app-brand)]';
  }

  if (status === 'pendingApproval') return 'bg-amber-400/10 text-amber-400';
  if (status === 'confirmed' || status === 'attended') return 'bg-emerald-400/10 text-emerald-400';
  if (status === 'rejected') return 'bg-red-500/10 text-red-400';

  return 'bg-white/5 text-[var(--color-app-muted)]';
}

export function GameStatusBadge({ status }: GameStatusBadgeProps) {
  return (
    <span
      className={`inline-flex h-6 shrink-0 items-center rounded-full px-2.5 text-xs font-semibold ${getStatusClassName(status)}`}
    >
      {statusLabels[status]}
    </span>
  );
}
