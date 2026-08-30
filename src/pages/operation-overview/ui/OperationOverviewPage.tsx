// 본인 게임의 운영 현황을 표시하고 신청자·수정 화면으로 연결

import { Link, NavLink, useNavigate, useParams } from 'react-router';
import { formatSessionCardDateTime, GameSessionStatusBadge } from '@/entities/game-session';
import { useViewerStore } from '@/entities/viewer';
import { Button, Card, ChevronRightIcon } from '@/shared/ui';
import { MobileLayout } from '@/widgets/mobile-layout';
import { useOperationOverview } from '../model/useOperationOverview';

const menuClassName = ({ isActive }: { isActive: boolean }) =>
  `flex flex-1 items-center justify-center rounded-sm text-xs focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-app-brand)] ${isActive ? 'bg-[var(--color-app-surface-secondary)] font-bold text-[var(--color-app-foreground)]' : 'font-medium text-[var(--color-app-muted)]'}`;

export function OperationOverviewPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const user = useViewerStore((state) => state.user);
  const navigate = useNavigate();
  const { data, errorMessage, notFound, forbidden, retry } = useOperationOverview(
    sessionId,
    user?.id,
  );

  // 조회 상태에 따른 콘텐츠만 분리해 공통 모바일 레이아웃은 한 번 렌더링한다.
  function renderOverviewContent() {
    if (!sessionId || notFound || forbidden) {
      return (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
          <p className="text-base font-bold text-[var(--color-app-foreground)]" role="alert">
            {forbidden ? '이 게임을 관리할 권한이 없습니다.' : '게임을 찾을 수 없습니다.'}
          </p>
          <Link
            className="text-sm font-bold text-[var(--color-app-brand)] underline underline-offset-4"
            to="/operations"
          >
            내가 만든 게임으로 돌아가기
          </Link>
        </div>
      );
    }

    if (errorMessage) {
      return (
        <div className="flex flex-col items-start gap-3">
          <p className="text-sm font-semibold text-[var(--color-app-danger)]" role="alert">
            {errorMessage}
          </p>
          <button
            className="cursor-pointer text-sm font-bold text-[var(--color-app-foreground)] underline underline-offset-4"
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
        <p className="text-sm text-[var(--color-app-muted)]" role="status">
          게임 운영 정보를 불러오는 중
        </p>
      );
    }

    const { session, pendingApprovalCount } = data;
    const overviewPath = `/operations/${session.id}`;
    const canEdit = ['recruiting', 'closed', 'inProgress'].includes(session.status);

    return (
      <article className="flex min-h-full shrink-0 flex-col gap-4">
        <div className="flex flex-col gap-3">
          <h2 className="text-base font-bold break-words text-[var(--color-app-foreground)]">
            {session.title}
          </h2>
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs text-[var(--color-app-muted)]">
              {formatSessionCardDateTime(session.startsAt, null)}
            </p>
            <GameSessionStatusBadge status={session.status} />
          </div>
        </div>

        <nav
          aria-label="게임 운영 메뉴"
          className="flex h-10 shrink-0 gap-1 rounded-md bg-[var(--color-app-surface)] p-1"
        >
          <NavLink className={menuClassName} end to={overviewPath}>
            개요
          </NavLink>
          <NavLink className={menuClassName} to={`${overviewPath}/applicants`}>
            신청자
          </NavLink>
        </nav>

        <div className="grid grid-cols-3 gap-2">
          <Card className="flex min-h-20 flex-col items-center justify-center gap-1 p-2 text-center">
            <p className="text-2xl font-bold text-[var(--color-app-success)]">
              {session.confirmedCount}
            </p>
            <p className="text-xs text-[var(--color-app-muted)]">참석 확정</p>
          </Card>
          <Link
            aria-label="승인 대기 신청자 보기"
            className="rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-app-brand)]"
            to={`${overviewPath}/applicants?status=pendingApproval`}
          >
            <Card className="flex h-full min-h-20 flex-col items-center justify-center gap-1 border-[var(--color-app-brand)] p-2 text-center text-[var(--color-app-brand)]">
              <p
                className={
                  pendingApprovalCount === null ? 'text-sm font-bold' : 'text-2xl font-bold'
                }
              >
                {pendingApprovalCount ?? '확인 불가'}
              </p>
              <span className="flex items-center gap-1 text-xs font-semibold">
                승인 대기
                <ChevronRightIcon />
              </span>
            </Card>
          </Link>
          <Card className="flex min-h-20 flex-col items-center justify-center gap-1 p-2 text-center">
            <p className="text-2xl font-bold text-[var(--color-app-brand)]">{session.capacity}</p>
            <p className="text-xs text-[var(--color-app-muted)]">정원</p>
          </Card>
        </div>

        {pendingApprovalCount === null && (
          <div className="flex flex-col items-start gap-2">
            <p className="text-sm text-[var(--color-app-muted)]" role="status">
              승인 대기 인원을 불러오지 못했습니다.
            </p>
            <button
              className="cursor-pointer text-sm font-bold text-[var(--color-app-foreground)] underline underline-offset-4"
              onClick={retry}
              type="button"
            >
              다시 시도
            </button>
          </div>
        )}

        {session.cancelDeadline && (
          <Card className="flex flex-col gap-2 p-4">
            <h3 className="text-sm font-bold text-[var(--color-app-foreground)]">취소 안내 기준</h3>
            <p className="text-xs text-[var(--color-app-muted)]">
              {formatSessionCardDateTime(session.cancelDeadline, null)}
            </p>
            <p className="text-xs text-[var(--color-app-foreground)]">
              안내용 기준이며 이후에도 참가 신청을 취소할 수 있습니다.
            </p>
          </Card>
        )}

        {canEdit && (
          <div className="mt-auto pt-4">
            <Button onClick={() => navigate(`${overviewPath}/edit`)} variant="secondary">
              게임 정보 수정
            </Button>
          </div>
        )}
      </article>
    );
  }

  return (
    <MobileLayout scrollable showBackButton title="게임 운영">
      {renderOverviewContent()}
    </MobileLayout>
  );
}
