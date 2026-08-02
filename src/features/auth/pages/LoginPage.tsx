// 이메일과 비밀번호로 Supabase 로그인을 처리하는 화면

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router';
import { signIn } from '@/api/auth/auth';
import { AuthAppError } from '@/api/auth/auth.error';
import { MobileLayout } from '@/app/layouts/MobileLayout';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { ArrowRightIcon } from '@/components/icons/ArrowRightIcon';
import { EmailIcon } from '@/components/icons/EmailIcon';
import { LockIcon } from '@/components/icons/LockIcon';
import { PasswordVisibilityButton } from '@/features/auth/components/PasswordVisibilityButton';
import { loginSchema } from '@/features/auth/schemas/login.schema';
import type { LoginFormValues } from '@/features/auth/schemas/login.schema';

export function LoginPage() {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const {
    clearErrors,
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    resetField,
    setError,
  } = useForm<LoginFormValues>({
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: zodResolver(loginSchema),
  });

  // 검증을 통과한 값으로 Supabase 세션을 생성
  async function handleLogin({ email, password }: LoginFormValues) {
    clearErrors('root.server');
    setSuccessMessage(null);

    try {
      const { session } = await signIn(email, password);

      if (!session) {
        setError('root.server', {
          message: '로그인 세션을 만들지 못했습니다. 다시 시도해 주세요.',
          type: 'server',
        });
        return;
      }

      resetField('password');
      setSuccessMessage('로그인되었습니다.');
    } catch (error) {
      setError('root.server', {
        message:
          error instanceof AuthAppError
            ? error.message
            : '로그인 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.',
        type: 'server',
      });
    }
  }

  return (
    <MobileLayout>
      <section className="flex h-full min-h-0 flex-col overflow-y-auto">
        <header className="flex flex-col gap-1 pt-8">
          <h1 className="text-3xl font-bold text-[var(--color-app-foreground)]">로그인</h1>
          <p className="text-sm font-semibold text-[var(--color-app-brand)]">
            Airsoft Schedule System
          </p>
        </header>

        <form
          className="mt-8 flex flex-col gap-6"
          noValidate
          onSubmit={handleSubmit(handleLogin, () => setSuccessMessage(null))}
        >
          <div className="flex flex-col gap-2">
            <Input
              {...register('email')}
              autoComplete="email"
              errorMessage={errors.email?.message}
              inputMode="email"
              label="이메일"
              leadingIcon={<EmailIcon />}
              placeholder="email@example.com"
              required
              type="email"
            />
            <Input
              {...register('password')}
              autoComplete="current-password"
              errorMessage={errors.password?.message}
              label="비밀번호"
              leadingIcon={<LockIcon />}
              minLength={6}
              placeholder="비밀번호 입력"
              required
              trailingElement={
                <PasswordVisibilityButton
                  isVisible={isPasswordVisible}
                  onToggle={() => setIsPasswordVisible((currentValue) => !currentValue)}
                />
              }
              type={isPasswordVisible ? 'text' : 'password'}
            />
          </div>

          {errors.root?.server?.message ? (
            <p className="text-sm font-semibold text-[var(--color-app-brand)]" role="alert">
              {errors.root.server.message}
            </p>
          ) : null}

          {successMessage ? (
            <p className="text-sm font-semibold text-[var(--color-app-foreground)]" role="status">
              {successMessage}
            </p>
          ) : null}

          <Button disabled={isSubmitting} trailingIcon={<ArrowRightIcon />} type="submit">
            {isSubmitting ? '로그인 중...' : '로그인'}
          </Button>

          <p className="text-center text-sm text-[var(--color-app-muted)]">
            계정이 없나요?{' '}
            <Link
              className="font-semibold text-[var(--color-app-brand)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-app-brand)]"
              to="/signup"
            >
              회원가입
            </Link>
          </p>
        </form>
      </section>
    </MobileLayout>
  );
}
