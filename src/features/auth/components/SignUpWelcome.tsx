// 회원가입 완료를 안내하고 사용자가 로그인 화면으로 이동할 수 있게 함

import { Link } from 'react-router';
import { ArrowRightIcon } from '@/components/icons/ArrowRightIcon';
import { CheckIcon } from '@/components/icons/CheckIcon';

type SignUpWelcomeProps = {
  displayName: string; // 환영 문구에 표시할 가입자 닉네임
  requiresEmailConfirmation: boolean; // 로그인 전에 이메일 인증이 필요한지 여부
};

export function SignUpWelcome({ displayName, requiresEmailConfirmation }: SignUpWelcomeProps) {
  return (
    <div
      aria-labelledby="signup-welcome-title"
      aria-live="polite"
      className="flex h-full flex-col items-center justify-center text-center"
    >
      <div className="flex size-16 items-center justify-center rounded-full border-2 border-[var(--color-app-brand)] bg-[var(--color-app-surface)] text-[var(--color-app-brand)] shadow-[0_10px_24px_var(--color-app-shadow)]">
        <CheckIcon />
      </div>

      <div className="mt-6 flex w-full flex-col items-center">
        <h1
          className="welcome-fade-in text-3xl font-bold text-[var(--color-app-foreground)]"
          id="signup-welcome-title"
        >
          {displayName}님, 환영합니다
        </h1>
        <p className="welcome-fade-in welcome-fade-in-delay mt-2 max-w-sm text-sm leading-6 text-[var(--color-app-muted)]">
          {requiresEmailConfirmation ? (
            <>
              {'가입이 완료되었습니다.'}
              <br />
              {'이메일로 전송된 인증 링크를 확인한 뒤 로그인해 주세요.'}
            </>
          ) : (
            <>
              {'가입이 완료되었습니다. '}
              <br />
              {'이제 새로운 게임 일정을 확인하고 참여를 시작해 보세요.'}
            </>
          )}
        </p>

        <Link
          className="mt-8 flex h-14 w-full items-center justify-center gap-2.5 rounded-lg bg-[var(--color-app-brand)] px-4 text-sm font-bold text-[var(--color-app-background)] shadow-[0_10px_24px_var(--color-app-shadow)] transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-app-brand)]"
          to="/login"
        >
          <span>로그인하러 가기</span>
          <span aria-hidden="true" className="flex size-5 shrink-0 items-center justify-center">
            <ArrowRightIcon />
          </span>
        </Link>
      </div>
    </div>
  );
}
