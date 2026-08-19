// 게임 홈 목록의 세션 요약 정보와 사용자 상태를 카드로 표시

import { Link } from 'react-router';
import {
  formatGameFee,
  formatPaymentMethod,
  formatSessionTimeRange,
  GameSessionStatusBadge,
} from '@/entities/game-session';
import { formatParticipationStatus } from '@/entities/participation';
import type { ParticipationStatus, SessionSummary } from '@/shared/api';
import { Card, UsersIcon } from '@/shared/ui';

type GameSessionCardProps = {
  isOwned: boolean; // 현재 사용자가 생성한 게임인지 여부
  participationStatus?: ParticipationStatus; // 현재 사용자의 참가 상태
  session: SessionSummary; // 카드에 표시할 게임 세션 요약 정보
};

function getSessionNotice(
  session: SessionSummary,
  isOwned: boolean,
  participationStatus?: ParticipationStatus,
) {
  if (isOwned) return '내가 운영하는 게임';
  if (participationStatus) return formatParticipationStatus(participationStatus);
  if (session.status === 'recruiting' && session.confirmedCount >= session.capacity) {
    return '대기 신청 가능';
  }
  if (session.status === 'recruiting') return '참가 신청 가능';
  return null;
}

export function GameSessionCard({ isOwned, participationStatus, session }: GameSessionCardProps) {
  const notice = getSessionNotice(session, isOwned, participationStatus);

  return (
    <Link
      aria-label={`${session.title} 상세 보기`}
      className="group block w-full rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-app-brand)]"
      to={`/games/${session.id}`}
    >
      <Card className="flex h-[108px] w-full flex-col gap-[5px] p-3.5">
        <div className="flex items-center justify-between gap-3">
          <p className="min-w-0 truncate text-[13px] font-extrabold text-[var(--color-app-foreground)]">
            {session.title}
          </p>
          <GameSessionStatusBadge status={session.status} />
        </div>

        <p className="truncate text-[10px] text-[var(--color-app-muted)]">
          {session.fieldName} · {formatSessionTimeRange(session.startsAt, session.endsAt)}
        </p>

        <div className="flex items-center justify-between gap-3 text-[10px]">
          <p className="font-medium text-[var(--color-app-muted)]">
            {formatGameFee(session.gameFee)} · {formatPaymentMethod(session.paymentMethod)}
          </p>
          <div className="flex items-center gap-1 font-bold text-[var(--color-app-foreground)]">
            <span aria-hidden="true" className="size-[13px] [&>svg]:size-full">
              <UsersIcon />
            </span>
            <span>
              {session.confirmedCount} / {session.capacity}명
            </span>
          </div>
        </div>

        {notice ? (
          <p className="truncate text-[10px] font-bold text-[var(--color-app-brand)]">{notice}</p>
        ) : null}
      </Card>
    </Link>
  );
}
