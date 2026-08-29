// 참가 신청 상태를 공통 문구와 의미별 색상으로 표시

import type { ParticipationStatus } from '@/shared/api';
import { StatusBadge } from '@/shared/ui';
import type { StatusBadgeTone } from '@/shared/ui';
import { getParticipationStatusLabel } from '../lib/participation-status';

type ParticipationStatusBadgeProps = {
  status: ParticipationStatus; // 표시할 참가 신청 상태
};

const statusTones: Record<ParticipationStatus, StatusBadgeTone> = {
  pendingApproval: 'warning',
  confirmed: 'success',
  attended: 'success',
  rejected: 'danger',
  cancelled: 'neutral',
};

export function ParticipationStatusBadge({ status }: ParticipationStatusBadgeProps) {
  return (
    <StatusBadge tone={statusTones[status]}>{getParticipationStatusLabel(status)}</StatusBadge>
  );
}
