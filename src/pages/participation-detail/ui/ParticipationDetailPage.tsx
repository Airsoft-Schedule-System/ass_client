// 선택한 참가 신청의 상태와 연결된 게임 정보를 표시

import { useNavigate, useParams } from 'react-router';
import { formatGameFee, formatSessionDateTime } from '@/entities/game-session';
import {
  getParticipationStatusTitle,
  isParticipationCancellable,
  ParticipationStatusBadge,
} from '@/entities/participation';
import { useViewerStore } from '@/entities/viewer';
import { CancelParticipationButton } from '@/features/cancel-participation';
import { Card } from '@/shared/ui';
import { MobileLayout } from '@/widgets/mobile-layout';
import { useParticipationDetail } from '../model/useParticipationDetail';

export function ParticipationDetailPage() {
  const navigate = useNavigate();
  const { participationId } = useParams<{ participationId: string }>();
  const user = useViewerStore((state) => state.user);
  const { data, errorMessage, notFound, refresh } = useParticipationDetail(
    participationId,
    user?.id,
  );

  // 공통 레이아웃 안에 표시할 조회 상태별 콘텐츠를 반환
  function renderParticipationDetail() {
    if (!participationId || notFound) {
      return (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
          <p className="text-base font-bold text-[var(--color-app-foreground)]">
            참가 내역을 찾을 수 없습니다.
          </p>
          <button
            className="text-sm font-bold text-[var(--color-app-brand)] underline underline-offset-4 enabled:cursor-pointer"
            onClick={() => navigate('/participations')}
            type="button"
          >
            내 참가 목록으로 돌아가기
          </button>
        </div>
      );
    }

    if (errorMessage) {
      return (
        <div className="flex flex-col items-start gap-3 pt-4">
          <p className="text-sm font-semibold text-[var(--color-app-danger)]" role="alert">
            {errorMessage}
          </p>
          <button
            className="text-sm font-bold text-[var(--color-app-foreground)] underline underline-offset-4 enabled:cursor-pointer"
            onClick={refresh}
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
          참가 상세를 불러오는 중
        </p>
      );
    }

    const canCancel =
      isParticipationCancellable(data.status) && data.session.status !== 'cancelled';

    return (
      <article className="flex flex-1 flex-col gap-4">
        <Card className="flex flex-col items-start gap-2.5 p-4.5">
          <ParticipationStatusBadge status={data.status} />
          <h2 className="text-xl font-extrabold text-[var(--color-app-foreground)]">
            {getParticipationStatusTitle(data.status)}
          </h2>
        </Card>

        <Card className="p-4">
          <h2 className="mb-3 text-base font-bold text-[var(--color-app-foreground)]">
            {data.session.title}
          </h2>
          <dl className="flex flex-col gap-3">
            <div className="flex items-start justify-between gap-4">
              <dt className="shrink-0 text-xs font-medium text-[var(--color-app-muted)]">일정</dt>
              <dd className="text-right text-sm font-semibold text-[var(--color-app-foreground)]">
                {formatSessionDateTime(data.session.startsAt, data.session.endsAt)}
              </dd>
            </div>
            <div className="flex items-start justify-between gap-4">
              <dt className="shrink-0 text-xs font-medium text-[var(--color-app-muted)]">필드</dt>
              <dd className="text-right text-sm font-semibold text-[var(--color-app-foreground)]">
                {data.session.fieldName}
              </dd>
            </div>
            <div className="flex items-start justify-between gap-4">
              <dt className="shrink-0 text-xs font-medium text-[var(--color-app-muted)]">게임비</dt>
              <dd className="text-right text-sm font-semibold text-[var(--color-app-foreground)]">
                {formatGameFee(data.session.gameFee)}
              </dd>
            </div>
          </dl>
        </Card>

        {canCancel ? (
          <div className="mt-auto pt-4">
            <CancelParticipationButton onSuccess={refresh} participationId={data.id} />
          </div>
        ) : null}
      </article>
    );
  }

  return (
    <MobileLayout showBackButton title="참가 상세">
      {renderParticipationDetail()}
    </MobileLayout>
  );
}
