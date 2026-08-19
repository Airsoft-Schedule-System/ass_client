// 다가오는 게임 일정과 현재 사용자의 참가·운영 상태를 표시하는 홈 화면

import { useViewerStore } from '@/entities/viewer';
import { MobileLayout } from '@/widgets/mobile-layout';
import { groupSessionsByDate } from '../lib/groupSessionsByDate';
import { useGameList } from '../model/useGameList';
import { GameSessionCard } from './GameSessionCard';

export function GameListPage() {
  const user = useViewerStore((state) => state.user);
  const { data, errorMessage, retry } = useGameList(user?.id);

  // 공통 레이아웃 안에 표시할 조회 상태별 콘텐츠를 반환
  function renderGamesContent() {
    if (errorMessage) {
      return (
        <div className="flex flex-col items-start gap-3 pt-4">
          <p className="text-sm font-semibold text-[var(--color-app-brand)]" role="alert">
            {errorMessage}
          </p>
          <button
            className="text-sm font-bold text-[var(--color-app-foreground)] underline underline-offset-4 enabled:cursor-pointer"
            onClick={retry}
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
