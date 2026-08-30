// 본인이 만든 게임과 승인 대기 현황을 표시하는 운영 목록 화면

import { useViewerStore } from '@/entities/viewer';
import { MobileLayout } from '@/widgets/mobile-layout';
import { useOperationList } from '../model/useOperationList';
import { OperationCard } from './OperationCard';

export function OperationListPage() {
  const user = useViewerStore((state) => state.user);
  const { data, errorMessage, retry } = useOperationList(user?.id);

  // 상태별 콘텐츠만 구분하고 공통 모바일 레이아웃은 한 번 렌더링한다.
  function renderOperationsContent() {
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
          내가 만든 게임을 불러오는 중
        </p>
      );
    }

    if (data.length === 0) {
      return (
        <div className="flex flex-1 items-center justify-center text-center">
          <p className="text-base font-bold text-[var(--color-app-foreground)]">
            아직 만든 게임이 없습니다.
          </p>
        </div>
      );
    }

    const hasUnavailableCounts = data.some((item) => item.pendingApprovalCount === null);

    return (
      <div className="mb-24 flex flex-col gap-4">
        {hasUnavailableCounts && (
          <div className="flex flex-col items-start gap-2">
            <p className="text-sm text-[var(--color-app-muted)]" role="status">
              일부 게임의 승인 대기 인원을 불러오지 못했습니다.
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
        <ul className="flex flex-col gap-4">
          {data.map((item) => (
            <li key={item.session.id}>
              <OperationCard item={item} />
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <MobileLayout
      description="내가 만든 게임을 관리하세요."
      scrollable
      showBottomNavigation
      title="내가 만든 게임"
    >
      {renderOperationsContent()}
    </MobileLayout>
  );
}
