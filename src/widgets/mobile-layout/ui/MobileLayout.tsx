// 모바일 화면의 공통 크기와 페이지 헤더·본문 구조를 관리하는 레이아웃

import type { ReactNode } from 'react';
import { BottomNavigation } from './BottomNavigation';
import { Header } from './Header';

type MobileLayoutProps = {
  children: ReactNode; // main 안에 배치할 페이지 핵심 콘텐츠
  description?: string; // 페이지 제목 아래에 표시할 선택 설명
  showBackButton?: boolean; // 페이지 헤더의 뒤로가기 버튼 표시 여부
  showBottomNavigation?: boolean; // 최상위 인증 화면의 하단 내비게이션 표시 여부
  title?: string; // main 위에 표시할 선택 페이지 제목
};

// 모든 모바일 페이지가 동일한 화면 규격과 시맨틱 구조를 사용하도록 구성
export function MobileLayout({
  children,
  description,
  showBackButton = false,
  showBottomNavigation = false,
  title,
}: MobileLayoutProps) {
  return (
    <div className="mx-auto flex h-dvh min-h-0 w-full max-w-120 flex-col overflow-hidden bg-[var(--color-app-background)] px-5 pt-[max(20px,var(--safe-area-top))] pb-[max(20px,var(--safe-area-bottom))]">
      {title ? (
        <Header description={description} showBackButton={showBackButton} title={title} />
      ) : null}
      <main className="my-4 flex min-h-0 w-full flex-1 flex-col overflow-y-auto">{children}</main>
      {showBottomNavigation ? (
        <div className="w-full shrink-0">
          <BottomNavigation />
        </div>
      ) : null}
    </div>
  );
}
