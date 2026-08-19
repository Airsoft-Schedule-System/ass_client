// 회원가입 행동과 완료 안내를 모바일 화면의 단계로 조립

import { useState } from 'react';
import { Link, Navigate } from 'react-router';
import { useViewerStore } from '@/entities/viewer';
import { SignUpForm } from '@/features/sign-up';
import type { SignUpResult } from '@/features/sign-up';
import { MobileLayout } from '@/widgets/mobile-layout';
import { SignUpWelcome } from './SignUpWelcome';

export function SignUpPage() {
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [completion, setCompletion] = useState<SignUpResult | null>(null);
  const authStatus = useViewerStore((state) => state.status);

  // 가입 중 생성되는 임시 세션은 완료 화면을 표시하기 전에 feature에서 종료
  if (authStatus === 'authenticated' && !isSigningUp) {
    return <Navigate replace to="/" />;
  }

  if (authStatus === 'initializing') return null;

  if (completion) {
    return (
      <MobileLayout>
        <SignUpWelcome
          displayName={completion.displayName}
          requiresEmailConfirmation={completion.requiresEmailConfirmation}
        />
      </MobileLayout>
    );
  }

  return (
    <MobileLayout description="Airsoft Schedule System" title="회원가입">
      <SignUpForm
        footer={
          <p className="text-center text-sm text-[var(--color-app-muted)]">
            이미 계정이 있나요?{' '}
            <Link
              className="font-semibold text-[var(--color-app-brand)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-app-brand)]"
              to="/login"
            >
              로그인
            </Link>
          </p>
        }
        onSigningUpChange={setIsSigningUp}
        onSuccess={setCompletion}
      />
    </MobileLayout>
  );
}
