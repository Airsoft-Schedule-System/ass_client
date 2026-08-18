// 현재 사용자의 게임 참가 내역이 들어갈 최상위 Placeholder 화면

import { MobileLayout } from '@/widgets/mobile-layout';

export function ParticipationListPage() {
  return (
    <MobileLayout description="신청한 게임을 확인해 보세요" showBottomNavigation title="내 참가">
      <div className="pt-8">
        <p className="text-sm text-[var(--color-app-muted)]">준비 중인 화면입니다.</p>
      </div>
    </MobileLayout>
  );
}
