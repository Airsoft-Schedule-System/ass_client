// 회원가입 입력을 검증하고 Supabase 가입 요청의 상태를 관리하는 폼

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import type { ReactNode } from 'react';
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
import { signUpSchema } from '../model/sign-up.schema';
import type { SignUpFormValues } from '../model/sign-up.schema';
import type { SignUpResult } from '../model/sign-up.types';

type SignUpFormProps = {
  footer?: ReactNode; // 폼 아래에 표시할 페이지 전용 보조 콘텐츠
  onSigningUpChange: (isSigningUp: boolean) => void; // 일시적인 인증 상태 변경 중 페이지 전환을 막기 위한 상태 전달
  onSuccess: (result: SignUpResult) => void; // 가입 성공 결과를 페이지 완료 화면에 전달
};

export function SignUpForm({ footer, onSigningUpChange, onSuccess }: SignUpFormProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isPasswordConfirmVisible, setIsPasswordConfirmVisible] = useState(false);
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

  async function handleSignUp({ displayName, email, password }: SignUpFormValues) {
    clearErrors('root.server');
    onSigningUpChange(true);

    try {
      const { session } = await signUp({
        displayName,
        email,
        password,
      });

      if (session) await signOut();

      onSuccess({
        displayName,
        requiresEmailConfirmation: !session,
      });
    } catch (error) {
      onSigningUpChange(false);
      setError('root.server', {
        message: toAuthError(error).message,
        type: 'server',
      });
    }
  }

  return (
    <form
      className="mt-8 flex min-h-0 flex-1 flex-col gap-6"
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
          maxLength={20}
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

      {footer}
    </form>
  );
}
