// 참가 상태를 화면에 표시할 공통 문구와 행동 가능 여부로 변환

import type { ParticipationStatus } from '@/shared/api';

const statusLabels: Record<ParticipationStatus, string> = {
  pendingApproval: '승인 대기',
  confirmed: '참석 확정',
  attended: '출석 완료',
  rejected: '참가 반려',
  cancelled: '신청 취소',
};

const statusTitles: Record<ParticipationStatus, string> = {
  pendingApproval: '참가 승인을 기다리고 있습니다.',
  confirmed: '참가가 확정되었습니다.',
  attended: '출석이 완료되었습니다.',
  rejected: '참가 신청이 반려되었습니다.',
  cancelled: '참가 신청이 취소되었습니다.',
};

export function getParticipationStatusLabel(status: ParticipationStatus) {
  return statusLabels[status];
}

export function getParticipationStatusTitle(status: ParticipationStatus) {
  return statusTitles[status];
}

export function isParticipationCancellable(status: ParticipationStatus) {
  return status === 'pendingApproval' || status === 'confirmed';
}
