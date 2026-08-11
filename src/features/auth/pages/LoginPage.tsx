// 이메일과 비밀번호로 Supabase 로그인을 처리하는 화면

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router';
import { signIn } from '@/api/auth/auth';
import { toAuthError } from '@/api/auth/auth.error';
import { MobileLayout } from '@/app/layouts/MobileLayout';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { ArrowRightIcon } from '@/components/icons/ArrowRightIcon';
import { EmailIcon } from '@/components/icons/EmailIcon';
import { LockIcon } from '@/components/icons/LockIcon';
import { PasswordVisibilityButton } from '@/features/auth/components/PasswordVisibilityButton';
import { loginSchema } from '@/features/auth/schemas/login.schema';
import type { LoginFormValues } from '@/features/auth/schemas/login.schema';
import { useAuthStore } from '@/features/auth/stores/auth.store';

export function LoginPage() {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const navigate = useNavigate();
  const setAuthUser = useAuthStore((state) => state.setAuthUser);
  const {
    clearErrors,
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
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

    try {
      const { user } = await signIn(email, password);

      setAuthUser(user);
      navigate('/', { replace: true });
    } catch (error) {
      setError('root.server', {
        message: toAuthError(error).message,
        type: 'server',
      });
    }
  }

  return (
    <MobileLayout description="Airsoft Schedule System" title="로그인">
      <form
        className="mt-8 flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto"
        noValidate
        onSubmit={handleSubmit(handleLogin)}
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

        <Button disabled={isSubmitting} trailingIcon={<ArrowRightIcon />} type="submit">
          {isSubmitting ? '로그인 중' : '로그인'}
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
    </MobileLayout>
  );
}
