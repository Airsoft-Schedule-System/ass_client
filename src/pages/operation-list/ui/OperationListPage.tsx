// 게임 운영 기능이 들어갈 최상위 Placeholder 화면

import { MobileLayout } from '@/widgets/mobile-layout';

export function OperationListPage() {
  return (
    <MobileLayout description="운영 중인 게임을 관리해 보세요" showBottomNavigation title="운영">
      <div className="pt-8">
        <p className="text-sm text-[var(--color-app-muted)]">준비 중인 화면입니다.</p>
      </div>
    </MobileLayout>
  );
}
