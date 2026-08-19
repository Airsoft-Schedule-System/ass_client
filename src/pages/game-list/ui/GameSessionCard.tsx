// 게임 홈 목록의 세션 요약 정보와 사용자 상태를 카드로 표시

import { Link } from 'react-router';
import {
  formatGameFee,
  formatPaymentMethod,
  formatSessionDateTime,
  GameSessionStatusBadge,
} from '@/entities/game-session';
import { ParticipationStatusBadge } from '@/entities/participation';
import type { ParticipationStatus, SessionSummary } from '@/shared/api';
import { CalendarIcon, Card, MapPinIcon, UsersIcon, WalletIcon } from '@/shared/ui';

type GameSessionCardProps = {
  isOwned: boolean; // 현재 사용자가 생성한 게임인지 여부
  participationStatus?: ParticipationStatus; // 현재 사용자의 참가 상태
  session: SessionSummary; // 카드에 표시할 게임 세션 요약 정보
};

export function GameSessionCard({ isOwned, participationStatus, session }: GameSessionCardProps) {
  return (
    <Link
      aria-label={`${session.title} 상세 보기`}
      className="group block w-full rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-app-brand)]"
      to={`/games/${session.id}`}
    >
      <Card className="flex w-full flex-col gap-4 p-4 transition-colors group-hover:border-[color-mix(in_srgb,var(--color-app-brand)_45%,transparent)]">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-base font-bold text-[var(--color-app-foreground)]">
              {session.title}
            </p>
            {isOwned && (
              <p className="mt-1 text-xs font-semibold text-[var(--color-app-brand)]">
                내가 만든 게임
              </p>
            )}
          </div>
          <GameSessionStatusBadge status={session.status} />
        </div>

        <dl className="flex flex-col gap-2 text-xs text-[var(--color-app-muted)]">
          <div className="flex items-center gap-2">
            <dt className="flex size-5 shrink-0 items-center justify-center" aria-label="장소">
              <MapPinIcon />
            </dt>
            <dd className="truncate">{session.fieldName}</dd>
          </div>
          <div className="flex items-center gap-2">
            <dt className="flex size-5 shrink-0 items-center justify-center" aria-label="일시">
              <CalendarIcon />
            </dt>
            <dd>{formatSessionDateTime(session.startsAt, session.endsAt)}</dd>
          </div>
        </dl>

        <div className="flex items-center justify-between gap-3 border-t border-[var(--color-app-border)] pt-3 text-xs">
          <div className="flex items-center gap-1.5 text-[var(--color-app-muted)]">
            <UsersIcon />
            <span>
              {session.confirmedCount}/{session.capacity}명
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-[var(--color-app-muted)]">
            <WalletIcon />
            <span>
              {formatGameFee(session.gameFee)} · {formatPaymentMethod(session.paymentMethod)}
            </span>
          </div>
        </div>

        {participationStatus && (
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs text-[var(--color-app-muted)]">내 참가 상태</span>
            <ParticipationStatusBadge status={participationStatus} />
          </div>
        )}
      </Card>
    </Link>
  );
}
