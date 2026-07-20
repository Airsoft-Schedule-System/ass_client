// 모바일 화면의 공통 콘텐츠 너비와 외부 여백을 관리하는 레이아웃

import type { PropsWithChildren } from 'react';

// 모바일 페이지가 동일한 화면 너비와 여백 안에서 콘텐츠를 배치하도록 제한
export function MobileLayout({ children }: PropsWithChildren) {
  return (
    <div className="mx-auto flex h-full w-full max-w-[480px] flex-col px-5 pt-[max(20px,var(--safe-area-top))] pb-[max(20px,var(--safe-area-bottom))]">
      {children}
    </div>
  );
}
