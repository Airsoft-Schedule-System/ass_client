// 참가 상태를 화면에 표시할 한국어 문구로 변환

import type { ParticipationStatus } from '@/shared/api';

const participationStatusLabels: Record<ParticipationStatus, string> = {
  pendingApproval: '승인 대기',
  awaitingPayment: '입금 대기',
  confirmed: '참석 확정',
  attended: '출석 완료',
  rejected: '반려',
  cancelled: '취소',
  refundRequested: '환불 요청',
};

export function formatParticipationStatus(status: ParticipationStatus) {
  return participationStatusLabels[status];
}
