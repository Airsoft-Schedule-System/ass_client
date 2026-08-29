// 내 참가 카드의 월·일·시작 시각을 간결한 화면 문구로 변환

const startTimeFormatter = new Intl.DateTimeFormat('ko-KR', {
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
});

export function formatParticipationSessionDate(startsAt: string) {
  const startDate = new Date(startsAt);

  return {
    month: `${startDate.getMonth() + 1}월`,
    day: String(startDate.getDate()).padStart(2, '0'),
    time: startTimeFormatter.format(startDate),
  };
}
