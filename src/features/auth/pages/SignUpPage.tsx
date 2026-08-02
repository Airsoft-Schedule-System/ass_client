// 사용자 정보를 입력받아 Supabase 회원가입을 처리하는 화면

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
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
import { signUpSchema } from '@/features/auth/schemas/signup.schema';
import type { SignUpFormValues } from '@/features/auth/schemas/signup.schema';

export function SignUpPage() {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isPasswordConfirmVisible, setIsPasswordConfirmVisible] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const {
    clearErrors,
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    resetField,
    setError,
  } = useForm<SignUpFormValues>({
    defaultValues: {
      displayName: '',
      email: '',
      password: '',
      passwordConfirm: '',
    },
    resolver: zodResolver(signUpSchema),
  });

  // 검증을 통과한 값으로 Supabase 회원가입을 요청
  async function handleSignUp({ displayName, email, password }: SignUpFormValues) {
    clearErrors('root.server');
    setSuccessMessage(null);

    try {
      const { session } = await signUp({
        displayName,
        email,
        password,
      });

      resetField('password');
      resetField('passwordConfirm');
      setSuccessMessage(
        session ? '회원가입이 완료되었습니다.' : '인증 메일을 보냈습니다. 이메일을 확인해 주세요.',
      );
    } catch (error) {
      setError('root.server', {
        message:
          error instanceof AuthAppError
            ? error.message
            : '회원가입 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.',
        type: 'server',
      });
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

        <form
          className="mt-8 flex flex-col gap-6"
          noValidate
          onSubmit={handleSubmit(handleSignUp, () => setSuccessMessage(null))}
        >
          <div className="flex flex-col gap-2">
            <Input
              {...register('displayName')}
              autoComplete="nickname"
              errorMessage={errors.displayName?.message}
              label="닉네임"
              leadingIcon={<UserIcon />}
              maxLength={30}
              placeholder="사용할 닉네임 입력"
              required
            />
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
              autoComplete="new-password"
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
            <Input
              {...register('passwordConfirm')}
              autoComplete="new-password"
              errorMessage={errors.passwordConfirm?.message}
              label="비밀번호 확인"
              leadingIcon={<LockIcon />}
              minLength={6}
              placeholder="비밀번호 다시 입력"
              required
              trailingElement={
                <PasswordVisibilityButton
                  isVisible={isPasswordConfirmVisible}
                  onToggle={() => setIsPasswordConfirmVisible((currentValue) => !currentValue)}
                />
              }
              type={isPasswordConfirmVisible ? 'text' : 'password'}
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
            {isSubmitting ? '가입 중...' : '회원가입'}
          </Button>

          <p className="text-center text-sm text-[var(--color-app-muted)]">
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
