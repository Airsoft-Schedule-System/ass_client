// 게임별 운영 개요 구현 전 진입과 뒤로가기를 제공하는 Placeholder 화면

import { MobileLayout } from '@/widgets/mobile-layout';

export function OperationOverviewPage() {
  return (
    <MobileLayout showBackButton title="게임 운영">
      <p className="text-sm text-[var(--color-app-muted)]">준비 중인 화면입니다.</p>
    </MobileLayout>
  );
}
