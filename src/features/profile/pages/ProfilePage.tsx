// 사용자 정보와 설정 기능이 들어갈 최상위 Placeholder 화면

import { MobileLayout } from '@/app/layouts/MobileLayout';

export function ProfilePage() {
  return (
    <MobileLayout description="내 정보와 설정을 관리해 보세요" showBottomNavigation title="내 정보">
      <div className="pt-8">
        <p className="text-sm text-[var(--color-app-muted)]">준비 중인 화면입니다.</p>
      </div>
    </MobileLayout>
  );
}
