// 게임 목록 Placeholder와 현재 사용자의 로그아웃 기능을 제공하는 최상위 화면

import { useState } from 'react';
import { signOut } from '@/api/auth/auth';
import { toAuthError } from '@/api/auth/auth.error';
import { MobileLayout } from '@/app/layouts/MobileLayout';
import { Button } from '@/components/common/Button';
import { useAuthStore } from '@/features/auth/stores/auth.store';

export function GamesPage() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const setAuthUser = useAuthStore((state) => state.setAuthUser);

  // Supabase 세션을 종료하고 인증 가드가 로그인 화면으로 전환하도록 상태를 비움
  async function handleLogout() {
    setErrorMessage(null);
    setIsLoggingOut(true);

    try {
      await signOut();
      setAuthUser(null);
    } catch (error) {
      setErrorMessage(toAuthError(error).message);
      setIsLoggingOut(false);
    }
  }

  return (
    <MobileLayout description="예정된 게임을 확인해 보세요" showBottomNavigation title="게임">
      <div className="flex min-h-0 flex-1 flex-col gap-4 pt-8">
        <p className="text-sm text-[var(--color-app-muted)]">준비 중인 화면입니다.</p>

        {errorMessage ? (
          <p className="text-sm font-semibold text-[var(--color-app-brand)]" role="alert">
            {errorMessage}
          </p>
        ) : null}

        <Button disabled={isLoggingOut} onClick={handleLogout}>
          {isLoggingOut ? '로그아웃 중' : '로그아웃'}
        </Button>
      </div>
    </MobileLayout>
  );
}
