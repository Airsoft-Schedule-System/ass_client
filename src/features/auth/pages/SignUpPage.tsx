// 사용자 정보를 입력받아 Supabase 회원가입을 처리하는 화면

import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link } from 'react-router';
import { signUp } from '@/api/auth/auth';
import { AuthAppError } from '@/api/auth/auth.error';
import { MobileLayout } from '@/app/layouts/MobileLayout';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { ArrowRightIcon } from '@/components/icons/ArrowRightIcon';
import { EmailIcon } from '@/components/icons/EmailIcon';
import { LockIcon } from '@/components/icons/LockIcon';
import { UserIcon } from '@/components/icons/UserIcon';
import { PasswordVisibilityButton } from '@/features/auth/components/PasswordVisibilityButton';

export function SignUpPage() {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isPasswordConfirmVisible, setIsPasswordConfirmVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  // 입력값을 확인한 뒤 Supabase에 회원가입을 요청
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;

    if (!displayName.trim()) {
      setFeedback('닉네임을 입력해 주세요.');
      return;
    }

    if (password !== passwordConfirm) {
      setFeedback('비밀번호가 일치하지 않습니다.');
      return;
    }

    setIsSubmitting(true);
    setFeedback(null);
    setIsSuccess(false);

    try {
      const { session } = await signUp({
        displayName: displayName.trim(),
        email: email.trim(),
        password,
      });

      setPassword('');
      setPasswordConfirm('');
      setIsSuccess(true);
      setFeedback(
        session ? '회원가입이 완료되었습니다.' : '인증 메일을 보냈습니다. 이메일을 확인해 주세요.',
      );
    } catch (error) {
      setFeedback(
        error instanceof AuthAppError
          ? error.message
          : '회원가입 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.',
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <MobileLayout>
      <section className="flex h-full min-h-0 flex-col overflow-y-auto">
        <header className="flex flex-col gap-1 pt-8">
          <h1 className="text-3xl font-bold text-[var(--color-app-foreground)]">회원가입</h1>
          <p className="text-sm font-semibold text-[var(--color-app-brand)]">
            Airsoft Schedule System
          </p>
        </header>

        <form className="mt-6 flex flex-col gap-5" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2">
            <Input
              autoComplete="nickname"
              label="닉네임"
              leadingIcon={<UserIcon />}
              maxLength={30}
              name="displayName"
              onChange={(event) => setDisplayName(event.target.value)}
              placeholder="사용할 닉네임 입력"
              required
              value={displayName}
            />
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
              autoComplete="new-password"
              label="비밀번호"
              leadingIcon={<LockIcon />}
              minLength={6}
              name="password"
              onChange={(event) => setPassword(event.target.value)}
              placeholder="비밀번호 입력"
              required
              trailingElement={
                <PasswordVisibilityButton
                  isVisible={isPasswordVisible}
                  onToggle={() => setIsPasswordVisible((currentValue) => !currentValue)}
                />
              }
              type={isPasswordVisible ? 'text' : 'password'}
              value={password}
            />
            <Input
              autoComplete="new-password"
              label="비밀번호 확인"
              leadingIcon={<LockIcon />}
              minLength={6}
              name="passwordConfirm"
              onChange={(event) => setPasswordConfirm(event.target.value)}
              placeholder="비밀번호 다시 입력"
              required
              trailingElement={
                <PasswordVisibilityButton
                  isVisible={isPasswordConfirmVisible}
                  onToggle={() => setIsPasswordConfirmVisible((currentValue) => !currentValue)}
                />
              }
              type={isPasswordConfirmVisible ? 'text' : 'password'}
              value={passwordConfirm}
            />
          </div>

          {feedback ? (
            <p
              className={`text-sm font-semibold ${isSuccess ? 'text-[var(--color-app-foreground)]' : 'text-[var(--color-app-brand)]'}`}
              role={isSuccess ? 'status' : 'alert'}
            >
              {feedback}
            </p>
          ) : null}

          <Button disabled={isSubmitting} trailingIcon={<ArrowRightIcon />} type="submit">
            {isSubmitting ? '가입 중...' : '회원가입'}
          </Button>

          <p className="pb-1 text-center text-sm text-[var(--color-app-muted)]">
            이미 계정이 있나요?{' '}
            <Link
              className="font-semibold text-[var(--color-app-brand)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-app-brand)]"
              to="/login"
            >
              로그인
            </Link>
          </p>
        </form>
      </section>
    </MobileLayout>
  );
}
