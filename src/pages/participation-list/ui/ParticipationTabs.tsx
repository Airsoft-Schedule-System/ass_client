// 진행 중과 지난 게임의 개수와 현재 선택 상태를 탭으로 표시

export type ParticipationTab = 'ongoing' | 'past';

type ParticipationTabsProps = {
  activeTab: ParticipationTab; // 현재 선택된 참가 목록 분류
  ongoingCount: number; // 진행 중인 게임 개수
  onChange: (tab: ParticipationTab) => void; // 선택한 목록 분류를 반영하는 함수
  pastCount: number; // 지난 게임 개수
};

const tabClassNames = {
  active: 'bg-[var(--color-app-surface-secondary)] font-bold text-[var(--color-app-foreground)]',
  inactive: 'font-medium text-[var(--color-app-muted)]',
};

export function ParticipationTabs({
  activeTab,
  ongoingCount,
  onChange,
  pastCount,
}: ParticipationTabsProps) {
  return (
    <div
      aria-label="참가 내역 분류"
      className="flex h-10 w-full gap-1.5 rounded-md bg-[var(--color-app-surface)] p-1"
      role="tablist"
    >
      <button
        aria-selected={activeTab === 'ongoing'}
        className={`flex flex-1 items-center justify-center rounded-sm text-xs enabled:cursor-pointer ${activeTab === 'ongoing' ? tabClassNames.active : tabClassNames.inactive}`}
        onClick={() => onChange('ongoing')}
        role="tab"
        type="button"
      >
        진행 중 {ongoingCount}
      </button>
      <button
        aria-selected={activeTab === 'past'}
        className={`flex flex-1 items-center justify-center rounded-sm text-xs enabled:cursor-pointer ${activeTab === 'past' ? tabClassNames.active : tabClassNames.inactive}`}
        onClick={() => onChange('past')}
        role="tab"
        type="button"
      >
        지난 게임 {pastCount}
      </button>
    </div>
  );
}
