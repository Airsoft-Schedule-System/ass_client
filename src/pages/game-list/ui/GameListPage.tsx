// 다가오는 게임 일정과 현재 사용자의 참가·운영 상태를 표시하는 홈 화면

import { useEffect, useState } from 'react';
import { formatSessionDate } from '@/entities/game-session';
import { useViewerStore } from '@/entities/viewer';
import {
  listParticipationsForUser,
  listUpcomingSessions,
  ParticipationAppError,
  toSessionError,
} from '@/shared/api';
import type { ParticipationSummary, SessionSummary } from '@/shared/api';
import { MobileLayout } from '@/widgets/mobile-layout';
import { GameSessionCard } from './GameSessionCard';

type GamesPageData = {
  participations: ParticipationSummary[]; // 현재 사용자의 참가 상태 목록
  sessions: SessionSummary[]; // 홈에 표시할 다가오는 게임 목록
};

type SessionDateGroup = {
  dateKey: string; // 날짜 그룹을 구분하는 로컬 날짜 키
  label: string; // 사용자에게 표시할 한국어 날짜
  sessions: SessionSummary[]; // 같은 날짜에 시작하는 게임 목록
};

// 세션과 참가 API 중 실패한 도메인의 사용자 메시지를 선택
function getGamesLoadErrorMessage(error: unknown) {
  if (error instanceof ParticipationAppError) return error.message;
  return toSessionError(error).message;
}

// 세션을 시작 시각으로 정렬한 뒤 사용자의 로컬 날짜 기준으로 묶음
function groupSessionsByDate(sessions: SessionSummary[]) {
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

export function GameListPage() {
  const [data, setData] = useState<GamesPageData | null>(null);
  const [loadErrorMessage, setLoadErrorMessage] = useState<string | null>(null);
  const [requestVersion, setRequestVersion] = useState(0);
  const user = useViewerStore((state) => state.user);

  useEffect(() => {
    if (!user) return;

    let cancelled = false;
    const userId = user.id;

    // 목록과 사용자 참가 상태를 병렬로 불러와 카드 표시 데이터를 구성
    async function loadGames() {
      setData(null);
      setLoadErrorMessage(null);

      try {
        const [sessions, participations] = await Promise.all([
          listUpcomingSessions(),
          listParticipationsForUser(userId),
        ]);

        if (!cancelled) setData({ participations, sessions });
      } catch (error) {
        if (!cancelled) setLoadErrorMessage(getGamesLoadErrorMessage(error));
      }
    }

    void loadGames();

    return () => {
      cancelled = true;
    };
  }, [requestVersion, user]);

  // 공통 레이아웃 안에 표시할 조회 상태별 콘텐츠를 반환
  function renderGamesContent() {
    if (loadErrorMessage) {
      return (
        <div className="flex flex-col items-start gap-3 pt-4">
          <p className="text-sm font-semibold text-[var(--color-app-brand)]" role="alert">
            {loadErrorMessage}
          </p>
          <button
            className="text-sm font-bold text-[var(--color-app-foreground)] underline underline-offset-4 enabled:cursor-pointer"
            onClick={() => setRequestVersion((version) => version + 1)}
            type="button"
          >
            다시 시도
          </button>
        </div>
      );
    }

    if (!data) {
      return (
        <p className="pt-4 text-sm text-[var(--color-app-muted)]" role="status">
          게임 일정을 불러오는 중
        </p>
      );
    }

    if (data.sessions.length === 0) {
      return (
        <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center">
          <p className="text-base font-bold text-[var(--color-app-foreground)]">
            예정된 게임이 없습니다
          </p>
          <p className="text-sm text-[var(--color-app-muted)]">
            새로운 게임이 등록되면 이곳에서 확인할 수 있습니다.
          </p>
        </div>
      );
    }

    const participationBySessionId = new Map(
      data.participations.map((participation) => [participation.gameSessionId, participation]),
    );
    const sessionDateGroups = groupSessionsByDate(data.sessions);

    return (
      <div className="mb-24 flex flex-col gap-6">
        {sessionDateGroups.map(({ dateKey, label, sessions }) => (
          <section aria-labelledby={`session-date-${dateKey}`} key={dateKey}>
            <h2
              className="mb-3 text-base font-extrabold text-[var(--color-app-brand)]"
              id={`session-date-${dateKey}`}
            >
              {label}
            </h2>
            <ul className="flex flex-col gap-3">
              {sessions.map((session) => (
                <li key={session.id}>
                  <GameSessionCard
                    isOwned={session.createdByUserId === user?.id}
                    participationStatus={participationBySessionId.get(session.id)?.status}
                    session={session}
                  />
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    );
  }

  return (
    <MobileLayout
      description="예정된 게임을 확인해 보세요"
      scrollable
      showBottomNavigation
      title="게임"
    >
      {renderGamesContent()}
    </MobileLayout>
  );
}
