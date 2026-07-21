// 이메일과 비밀번호로 Supabase 로그인을 처리하는 화면

import { useState } from 'react';
import type { FormEvent } from 'react';
import { signIn } from '@/api/auth/auth';
import { AuthAppError } from '@/api/auth/auth.error';
import { MobileLayout } from '@/app/layouts/MobileLayout';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { ArrowRightIcon } from '@/components/icons/ArrowRightIcon';
import { EmailIcon } from '@/components/icons/EmailIcon';
import { EyeIcon } from '@/components/icons/EyeIcon';
import { LockIcon } from '@/components/icons/LockIcon';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  // 중복 제출을 막고 Supabase 세션 생성 결과를 화면에 반영
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setFeedback(null);
    setIsSuccess(false);

    try {
      const { session } = await signIn(email.trim(), password);

      if (!session) {
        setFeedback('로그인 세션을 만들지 못했습니다. 다시 시도해 주세요.');
        return;
      }

      setPassword('');
      setIsSuccess(true);
      setFeedback('로그인되었습니다.');
    } catch (error) {
      setFeedback(
        error instanceof AuthAppError
          ? error.message
          : '로그인 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.',
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <MobileLayout>
      <section className="flex h-full flex-col">
        <header className="flex flex-col gap-1 pt-8">
          <h1 className="text-3xl font-bold text-[var(--color-app-foreground)]">로그인</h1>
          <p className="text-sm font-semibold text-[var(--color-app-brand)]">
            Airsoft Schedule System
          </p>
        </header>

        <form className="mt-8 flex flex-col gap-6" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2">
            <Input
              autoComplete="email"
              inputMode="email"
              label="이메일"
              leadingIcon={<EmailIcon />}
              name="email"
              onChange={(event) => setEmail(event.target.value)}
              placeholder="email@example.com"
              required
              type="email"
              value={email}
            />
            <Input
              autoComplete="current-password"
              label="비밀번호"
              leadingIcon={<LockIcon />}
              minLength={6}
              name="password"
              onChange={(event) => setPassword(event.target.value)}
              placeholder="비밀번호 입력"
              required
              trailingElement={
                <button
                  aria-label={isPasswordVisible ? '비밀번호 숨기기' : '비밀번호 표시'}
                  aria-pressed={isPasswordVisible}
                  className="flex size-10 items-center justify-center rounded-md text-[var(--color-app-muted)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-app-brand)]"
                  onClick={() => setIsPasswordVisible((currentValue) => !currentValue)}
                  type="button"
                >
                  <EyeIcon />
                </button>
              }
              type={isPasswordVisible ? 'text' : 'password'}
              value={password}
            />
          </div>

          {feedback ? (
            <p
              className={`text-sm font-semibold ${!isSuccess ? 'text-[var(--color-app-brand)]' : 'text-[var(--color-app-foreground)]'}`}
              role={isSuccess ? 'status' : 'alert'}
            >
              {feedback}
            </p>
          ) : null}

          <Button disabled={isSubmitting} trailingIcon={<ArrowRightIcon />} type="submit">
            {isSubmitting ? '로그인 중...' : '로그인'}
          </Button>
        </form>
      </section>
    </MobileLayout>
  );
}
