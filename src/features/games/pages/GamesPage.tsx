// 다가오는 게임 일정과 현재 사용자의 참가·운영 상태를 표시하는 홈 화면

import { useEffect, useState } from 'react';
import { listParticipationsForUser } from '@/api/participations/participations';
import type { ParticipationSummary } from '@/api/participations/participations';
import { ParticipationAppError } from '@/api/participations/participations.error';
import { listUpcomingSessions } from '@/api/sessions/sessions';
import type { SessionSummary } from '@/api/sessions/sessions';
import { toSessionError } from '@/api/sessions/sessions.error';
import { MobileLayout } from '@/app/layouts/MobileLayout';
import { GameSessionCard } from '@/features/games/components/GameSessionCard';
import { useAuthStore } from '@/features/auth/stores/auth.store';

type GamesPageData = {
  participations: ParticipationSummary[]; // 현재 사용자의 참가 상태 목록
  sessions: SessionSummary[]; // 홈에 표시할 다가오는 게임 목록
};

// 세션과 참가 API 중 실패한 도메인의 사용자 메시지를 선택
function getGamesLoadErrorMessage(error: unknown) {
  if (error instanceof ParticipationAppError) return error.message;
  return toSessionError(error).message;
}

export function GamesPage() {
  const [data, setData] = useState<GamesPageData | null>(null);
  const [loadErrorMessage, setLoadErrorMessage] = useState<string | null>(null);
  const [requestVersion, setRequestVersion] = useState(0);
  const user = useAuthStore((state) => state.user);

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

    return (
      <ul className="flex flex-col gap-3">
        {data.sessions.map((session) => (
          <li key={session.id}>
            <GameSessionCard
              isOwned={session.createdByUserId === user?.id}
              participationStatus={participationBySessionId.get(session.id)?.status}
              session={session}
            />
          </li>
        ))}
      </ul>
    );
  }

  return (
    <MobileLayout description="예정된 게임을 확인해 보세요" showBottomNavigation title="게임">
      {renderGamesContent()}
    </MobileLayout>
  );
}
