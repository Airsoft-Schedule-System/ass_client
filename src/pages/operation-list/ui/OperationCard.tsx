// 운영 목록에서 게임 정보와 확정·승인 대기 인원을 표시

import { Link } from 'react-router';
import { formatSessionCardDateTime, GameSessionStatusBadge } from '@/entities/game-session';
import { Card, ChevronRightIcon } from '@/shared/ui';
import type { OperationListItem } from '../model/useOperationList';

type OperationCardProps = {
  item: OperationListItem; // 카드에 표시할 게임과 승인 대기 집계
};

export function OperationCard({ item }: OperationCardProps) {
  const { session, pendingApprovalCount } = item;

  return (
    <Link
      aria-label={`${session.title} 게임 운영 보기`}
      className="block w-full rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-app-brand)]"
      to={`/operations/${session.id}`}
    >
      <Card className="flex w-full flex-col gap-3 p-4">
        <div className="flex items-center gap-3">
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <h2 className="truncate text-base font-bold text-[var(--color-app-foreground)]">
              {session.title}
            </h2>
            <p className="text-xs text-[var(--color-app-muted)]">
              {formatSessionCardDateTime(session.startsAt, null)}
            </p>
          </div>
          <span className="shrink-0 text-[var(--color-app-muted)]">
            <ChevronRightIcon />
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-center text-xs font-semibold text-[var(--color-app-muted)]">
          <p className="flex min-h-8 items-center justify-center rounded-sm bg-[var(--color-app-surface-secondary)] px-2 py-1">
            {session.confirmedCount} / {session.capacity} 확정
          </p>
          <p className="flex min-h-8 items-center justify-center rounded-sm bg-[var(--color-app-surface-secondary)] px-2 py-1">
            {pendingApprovalCount === null
              ? '승인 대기 확인 불가'
              : `${pendingApprovalCount} 승인 대기`}
          </p>
        </div>
        <div className="flex">
          <GameSessionStatusBadge status={session.status} />
        </div>
      </Card>
    </Link>
  );
}
