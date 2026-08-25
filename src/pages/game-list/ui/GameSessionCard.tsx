// 게임 홈 목록의 세션 요약 정보를 카드로 표시

import { Link } from 'react-router';
import {
  formatGameFee,
  formatSessionCardDateTime,
  GameSessionStatusBadge,
} from '@/entities/game-session';
import type { SessionSummary } from '@/shared/api';
import { Card, UsersIcon } from '@/shared/ui';

type GameSessionCardProps = {
  session: SessionSummary; // 카드에 표시할 게임 세션 요약 정보
};

export function GameSessionCard({ session }: GameSessionCardProps) {
  return (
    <Link
      aria-label={`${session.title} 상세 보기`}
      className="group block w-full rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-app-brand)]"
      to={`/games/${session.id}`}
    >
      <Card className="flex h-28 w-full flex-col gap-2 p-3.5">
        <div className="flex h-6 min-w-0 items-center gap-2">
          <p className="min-w-0 truncate text-xs font-extrabold text-[var(--color-app-foreground)]">
            {session.title}
          </p>
          <GameSessionStatusBadge status={session.status} />
        </div>

        <div className="flex min-h-0 flex-1 items-center justify-between gap-3">
          <div className="flex min-w-0 flex-col gap-0.5">
            <p className="truncate text-xs font-semibold text-[var(--color-app-foreground)]">
              {formatSessionCardDateTime(session.startsAt, session.endsAt)}
            </p>
            <p className="truncate text-xs font-semibold text-[var(--color-app-foreground)]">
              {session.fieldName}
            </p>
            <p className="truncate text-xs font-medium text-[var(--color-app-muted)]">
              참가비 {formatGameFee(session.gameFee)}
            </p>
          </div>

          <div className="flex shrink-0 flex-col items-end gap-0.5">
            <span className="text-xs font-semibold text-[var(--color-app-muted)]">인원</span>
            <div className="flex items-center gap-1 text-xs font-bold text-[var(--color-app-foreground)]">
              <span aria-hidden="true" className="size-3.5 [&>svg]:size-full">
                <UsersIcon />
              </span>
              <span>
                {session.confirmedCount} / {session.capacity}명
              </span>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
