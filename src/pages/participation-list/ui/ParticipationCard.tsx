// 참가 내역의 게임 일정과 현재 참가 상태를 목록 카드로 표시

import { Link } from 'react-router';
import { ParticipationStatusBadge } from '@/entities/participation';
import type { UserParticipation } from '@/shared/api';
import { Card } from '@/shared/ui';
import { formatParticipationSessionDate } from '../lib/formatParticipationSession';

type ParticipationCardProps = {
  participation: UserParticipation; // 카드에 표시할 참가 내역과 게임 정보
};

export function ParticipationCard({ participation }: ParticipationCardProps) {
  const { day, month, time } = formatParticipationSessionDate(participation.session.startsAt);

  return (
    <Link
      aria-label={`${participation.session.title} 참가 상세 보기`}
      className="block w-full rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-app-brand)]"
      to={`/participations/${participation.id}`}
    >
      <Card className="flex w-full items-center gap-3.5 p-3.5">
        <div className="flex h-13 w-12 shrink-0 flex-col items-center justify-center rounded-md bg-[var(--color-app-surface-secondary)]">
          <span className="text-xs font-semibold text-[var(--color-app-muted)]">{month}</span>
          <span className="text-xl font-extrabold text-[var(--color-app-brand)]">{day}</span>
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <p className="truncate text-sm font-bold text-[var(--color-app-foreground)]">
            {participation.session.title}
          </p>
          <p className="truncate text-xs text-[var(--color-app-muted)]">
            {participation.session.fieldName} · {time}
          </p>
        </div>
        <ParticipationStatusBadge status={participation.status} />
      </Card>
    </Link>
  );
}
