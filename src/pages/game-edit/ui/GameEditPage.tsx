// 게임 수정 구현 전 진입 경로와 운영 개요 복귀를 제공

import { Link, useParams } from 'react-router';
import { MobileLayout } from '@/widgets/mobile-layout';

export function GameEditPage() {
  const { sessionId } = useParams<{ sessionId: string }>();

  return (
    <MobileLayout showBackButton title="게임 수정">
      <div className="flex flex-col items-start gap-3">
        <p className="text-sm text-[var(--color-app-muted)]">준비 중인 화면입니다.</p>
        <Link
          className="text-sm font-bold text-[var(--color-app-brand)] underline underline-offset-4"
          to={`/operations/${sessionId}`}
        >
          게임 운영 개요로 돌아가기
        </Link>
      </div>
    </MobileLayout>
  );
}
