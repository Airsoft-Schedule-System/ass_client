// 참가 신청 상태를 사용자용 문구와 색상으로 표시

import type { ParticipationStatus } from '@/shared/api';
import { StatusBadge } from '@/shared/ui';
import type { StatusBadgeTone } from '@/shared/ui';

type ParticipationStatusBadgeProps = {
  status: ParticipationStatus; // 표시할 참가 신청 상태
};

const statusLabels: Record<ParticipationStatus, string> = {
  pendingApproval: '승인 대기',
  awaitingPayment: '입금 대기',
  confirmed: '참석 확정',
  attended: '출석 완료',
  rejected: '반려',
  cancelled: '취소',
  refundRequested: '환불 요청',
};

const statusTones: Record<ParticipationStatus, StatusBadgeTone> = {
  pendingApproval: 'warning',
  awaitingPayment: 'brand',
  confirmed: 'success',
  attended: 'success',
  rejected: 'danger',
  cancelled: 'neutral',
  refundRequested: 'neutral',
};

export function ParticipationStatusBadge({ status }: ParticipationStatusBadgeProps) {
  return <StatusBadge tone={statusTones[status]}>{statusLabels[status]}</StatusBadge>;
}
