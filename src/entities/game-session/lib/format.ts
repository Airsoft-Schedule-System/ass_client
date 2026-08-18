// 게임 세션의 날짜·금액·결제 방식을 화면용 한국어 문구로 변환

import type { PaymentMethod } from '@/shared/api';

const sessionDateFormatter = new Intl.DateTimeFormat('ko-KR', {
  month: 'long',
  day: 'numeric',
  weekday: 'short',
});

const sessionTimeFormatter = new Intl.DateTimeFormat('ko-KR', {
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
});

const gameFeeFormatter = new Intl.NumberFormat('ko-KR');

// 시작 시각을 날짜별 목록 제목으로 변환
export function formatSessionDate(startsAt: string) {
  const startDate = new Date(startsAt);
  if (Number.isNaN(startDate.getTime())) return '일정 미정';

  return sessionDateFormatter.format(startDate);
}

// 시작과 종료 시각을 같은 화면 형식으로 조합
export function formatSessionDateTime(startsAt: string, endsAt: string | null) {
  const startDate = new Date(startsAt);
  if (Number.isNaN(startDate.getTime())) return '일정 미정';

  const date = formatSessionDate(startsAt);
  const startTime = sessionTimeFormatter.format(startDate);

  if (!endsAt) return `${date} ${startTime}`;

  const endDate = new Date(endsAt);
  if (Number.isNaN(endDate.getTime())) return `${date} ${startTime}`;

  return `${date} ${startTime}–${sessionTimeFormatter.format(endDate)}`;
}

// 정수 게임비를 원화 문구로 변환
export function formatGameFee(gameFee: number) {
  return `${gameFeeFormatter.format(gameFee)}원`;
}

// 백엔드 결제 enum을 사용자용 문구로 변환
export function formatPaymentMethod(paymentMethod: PaymentMethod) {
  const labels: Record<PaymentMethod, string> = {
    pre_transfer: '선입금',
  };

  return labels[paymentMethod];
}
