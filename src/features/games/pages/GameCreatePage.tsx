// 새로운 게임 생성 기능이 들어갈 최상위 Placeholder 화면

import { MobileLayout } from '@/app/layouts/MobileLayout';

export function GameCreatePage() {
  return (
    <MobileLayout
      description="새로운 게임 일정을 등록해 보세요"
      showBottomNavigation
      title="만들기"
    >
      <div className="pt-8">
        <p className="text-sm text-[var(--color-app-muted)]">준비 중인 화면입니다.</p>
      </div>
    </MobileLayout>
  );
}
