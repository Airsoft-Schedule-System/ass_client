// 모바일 화면의 공통 크기와 페이지 헤더·본문 구조를 관리하는 레이아웃

import type { ReactNode } from 'react';
import { BottomNavigation } from './BottomNavigation';
import { Header } from './Header';

type MobileLayoutProps = {
  children: ReactNode; // main 안에 배치할 페이지 핵심 콘텐츠
  description?: string; // 페이지 제목 아래에 표시할 선택 설명
  scrollable?: boolean; // main 영역의 세로 스크롤을 활성화할지 여부
  showBackButton?: boolean; // 페이지 헤더의 뒤로가기 버튼 표시 여부
  showBottomNavigation?: boolean; // 최상위 인증 화면의 하단 내비게이션 표시 여부
  title?: string; // main 위에 표시할 선택 페이지 제목
};

// 모든 모바일 페이지가 동일한 화면 규격과 시맨틱 구조를 사용하도록 구성
export function MobileLayout({
  children,
  description,
  scrollable = false,
  showBackButton = false,
  showBottomNavigation = false,
  title,
}: MobileLayoutProps) {
  const extendsBehindBottomNavigation = showBottomNavigation && scrollable;

  return (
    <div
      className={`relative mx-auto flex h-dvh min-h-0 w-full max-w-120 flex-col overflow-hidden bg-[var(--color-app-background)] px-5 pt-[max(20px,var(--safe-area-top))] ${extendsBehindBottomNavigation ? 'pb-0' : 'pb-[max(20px,var(--safe-area-bottom))]'}`}
    >
      {title ? (
        <Header description={description} showBackButton={showBackButton} title={title} />
      ) : null}
      {/* 하단바 뒤 확장을 허용한 화면은 main의 margin과 보호 여백도 제거 */}
      <main
        className={`mt-4 flex min-h-0 w-full flex-1 flex-col ${scrollable ? 'overflow-y-auto' : 'overflow-hidden'} ${extendsBehindBottomNavigation ? 'mb-0' : 'mb-4'} ${showBottomNavigation && !extendsBehindBottomNavigation ? 'pb-17' : ''}`}
      >
        {children}
      </main>
      {showBottomNavigation ? (
        <div className="absolute right-5 bottom-[max(20px,var(--safe-area-bottom))] left-5 z-20">
          <BottomNavigation />
        </div>
      ) : null}
    </div>
  );
}
