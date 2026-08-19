// 참가 신청 상태를 사용자용 문구와 색상으로 표시

import type { ParticipationStatus } from '@/shared/api';
import { StatusBadge } from '@/shared/ui';
import type { StatusBadgeTone } from '@/shared/ui';
import { formatParticipationStatus } from '../lib/format';

type ParticipationStatusBadgeProps = {
  status: ParticipationStatus; // 표시할 참가 신청 상태
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
  return <StatusBadge tone={statusTones[status]}>{formatParticipationStatus(status)}</StatusBadge>;
}
