// 게임 목록 기능이 들어갈 최상위 Placeholder 화면

import { MobileLayout } from '@/app/layouts/MobileLayout';

export function GamesPage() {
  return (
    <MobileLayout description="예정된 게임을 확인해 보세요" showBottomNavigation title="게임">
      <div className="pt-8">
        <p className="text-sm text-[var(--color-app-muted)]">준비 중인 화면입니다.</p>
      </div>
    </MobileLayout>
  );
}
