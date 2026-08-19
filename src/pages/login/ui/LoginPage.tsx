// 로그인 행동과 회원가입 이동을 모바일 화면으로 조립

import { Link, useNavigate } from 'react-router';
import { SignInForm } from '@/features/sign-in';
import { MobileLayout } from '@/widgets/mobile-layout';

export function LoginPage() {
  const navigate = useNavigate();

  return (
    <MobileLayout description="Airsoft Schedule System" title="로그인">
      <SignInForm
        footer={
          <p className="text-center text-sm text-[var(--color-app-muted)]">
            계정이 없나요?{' '}
            <Link
              className="font-semibold text-[var(--color-app-brand)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-app-brand)]"
              to="/signup"
            >
              회원가입
            </Link>
          </p>
        }
        onSuccess={() => navigate('/', { replace: true })}
      />
    </MobileLayout>
  );
}
