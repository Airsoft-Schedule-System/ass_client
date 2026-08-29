// 현재 사용자의 참가 내역을 진행 중과 지난 게임으로 구분해 표시

import { useState } from 'react';
import { useViewerStore } from '@/entities/viewer';
import { MobileLayout } from '@/widgets/mobile-layout';
import { partitionParticipations } from '../lib/partitionParticipations';
import { useParticipationList } from '../model/useParticipationList';
import { ParticipationCard } from './ParticipationCard';
import { ParticipationTabs } from './ParticipationTabs';
import type { ParticipationTab } from './ParticipationTabs';

export function ParticipationListPage() {
  const user = useViewerStore((state) => state.user);
  const [activeTab, setActiveTab] = useState<ParticipationTab>('ongoing');
  const { data, errorMessage, retry } = useParticipationList(user?.id);

  // 공통 레이아웃 안에 표시할 조회 상태별 콘텐츠를 반환
  function renderParticipationContent() {
    if (errorMessage) {
      return (
        <div className="flex flex-col items-start gap-3 pt-4">
          <p className="text-sm font-semibold text-[var(--color-app-danger)]" role="alert">
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
          참가 내역을 불러오는 중
        </p>
      );
    }

    const groups = partitionParticipations(data);
    const visibleParticipations = groups[activeTab];

    return (
      <div className="mb-24 flex flex-col gap-4">
        <ParticipationTabs
          activeTab={activeTab}
          ongoingCount={groups.ongoing.length}
          onChange={setActiveTab}
          pastCount={groups.past.length}
        />
        {visibleParticipations.length > 0 ? (
          <ul className="flex flex-col gap-2">
            {visibleParticipations.map((participation) => (
              <li key={participation.id}>
                <ParticipationCard participation={participation} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="pt-8 text-center text-sm text-[var(--color-app-muted)]">
            {activeTab === 'ongoing' ? '진행 중인 게임이 없습니다.' : '지난 게임이 없습니다.'}
          </p>
        )}
      </div>
    );
  }

  return (
    <MobileLayout
      description="신청한 게임을 확인하세요."
      scrollable
      showBottomNavigation
      title="내 참가"
    >
      {renderParticipationContent()}
    </MobileLayout>
  );
}
