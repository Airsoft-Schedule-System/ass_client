// 게임 세션을 시작 시각으로 정렬하고 사용자의 로컬 날짜별로 그룹화

import { formatSessionDate } from '@/entities/game-session';
import type { SessionSummary } from '@/shared/api';

export type SessionDateGroup = {
  dateKey: string; // 날짜 그룹을 구분하는 로컬 날짜 키
  label: string; // 사용자에게 표시할 한국어 날짜
  sessions: SessionSummary[]; // 같은 날짜에 시작하는 게임 목록
};

export function groupSessionsByDate(sessions: SessionSummary[]) {
  const groups = new Map<string, SessionDateGroup>();
  const sortedSessions = [...sessions].sort((first, second) => {
    const firstTime = new Date(first.startsAt).getTime();
    const secondTime = new Date(second.startsAt).getTime();

    return (
      (Number.isNaN(firstTime) ? Infinity : firstTime) -
      (Number.isNaN(secondTime) ? Infinity : secondTime)
    );
  });

  sortedSessions.forEach((session) => {
    const date = new Date(session.startsAt);
    const dateKey = Number.isNaN(date.getTime())
      ? 'unknown'
      : `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    const existingGroup = groups.get(dateKey);

    if (existingGroup) {
      existingGroup.sessions.push(session);
      return;
    }

    groups.set(dateKey, {
      dateKey,
      label: formatSessionDate(session.startsAt),
      sessions: [session],
    });
  });

  return [...groups.values()];
}
