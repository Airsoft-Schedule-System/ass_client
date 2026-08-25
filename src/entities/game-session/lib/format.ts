// 게임 세션의 날짜·금액을 화면용 한국어 문구로 변환

const sessionDateFormatter = new Intl.DateTimeFormat('ko-KR', {
  month: 'long',
  day: 'numeric',
  weekday: 'short',
});

const sessionCardDateFormatter = new Intl.DateTimeFormat('ko-KR', {
  month: 'long',
  day: 'numeric',
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

// 목록 카드에서 날짜를 제외한 시작·종료 시각만 표시
export function formatSessionTimeRange(startsAt: string, endsAt: string | null) {
  const startDate = new Date(startsAt);
  if (Number.isNaN(startDate.getTime())) return '시간 미정';

  const startTime = sessionTimeFormatter.format(startDate);
  if (!endsAt) return startTime;

  const endDate = new Date(endsAt);
  if (Number.isNaN(endDate.getTime())) return startTime;

  return `${startTime} - ${sessionTimeFormatter.format(endDate)}`;
}

// 목록 카드에서 시작 날짜와 시간 범위를 한 줄로 조합
export function formatSessionCardDateTime(startsAt: string, endsAt: string | null) {
  const startDate = new Date(startsAt);
  if (Number.isNaN(startDate.getTime())) return '일정 미정';

  return `${sessionCardDateFormatter.format(startDate)} ${formatSessionTimeRange(startsAt, endsAt)}`;
}

// 정수 게임비를 원화 문구로 변환
export function formatGameFee(gameFee: number) {
  return `${gameFeeFormatter.format(gameFee)}원`;
}
