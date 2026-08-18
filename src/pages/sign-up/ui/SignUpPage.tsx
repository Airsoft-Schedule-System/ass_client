// 사용자 정보를 입력받아 Supabase 회원가입을 처리하는 화면

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Link, Navigate } from 'react-router';
import { useViewerStore } from '@/entities/viewer';
import { signOut, signUp, toAuthError } from '@/shared/api';
import {
  ArrowRightIcon,
  Button,
  EmailIcon,
  Input,
  LockIcon,
  PasswordVisibilityButton,
  UserIcon,
} from '@/shared/ui';
import { MobileLayout } from '@/widgets/mobile-layout';
import { signUpSchema } from '../model/signup.schema';
import type { SignUpFormValues } from '../model/signup.schema';
import { SignUpWelcome } from './SignUpWelcome';

type SignUpCompletion = {
  displayName: string; // Welcome 화면에 표시할 가입자 닉네임
  requiresEmailConfirmation: boolean; // 로그인 전에 이메일 인증이 필요한지 여부
};

export function SignUpPage() {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isPasswordConfirmVisible, setIsPasswordConfirmVisible] = useState(false);
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [completion, setCompletion] = useState<SignUpCompletion | null>(null);
  const authStatus = useViewerStore((state) => state.status);
  const {
    clearErrors,
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
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
    setIsSigningUp(true);

    try {
      const { session } = await signUp({
        displayName,
        email,
        password,
      });

      if (session) await signOut();

      setCompletion({
        displayName,
        requiresEmailConfirmation: !session,
      });
    } catch (error) {
      setIsSigningUp(false);
      setError('root.server', {
        message: toAuthError(error).message,
        type: 'server',
      });
    }
  }

  // 기존 로그인 사용자는 회원가입 화면 대신 메인 화면을 사용
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
      <form
        className="mt-8 flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto"
        noValidate
        onSubmit={handleSubmit(handleSignUp)}
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

        <Button disabled={isSubmitting} trailingIcon={<ArrowRightIcon />} type="submit">
          {isSubmitting ? '가입 중' : '회원가입'}
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
    </MobileLayout>
  );
}
