// 이메일과 비밀번호를 검증하고 로그인 요청 상태를 관리하는 폼

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import type { ReactNode } from 'react';
import { useViewerStore } from '@/entities/viewer';
import { signIn, toAuthError } from '@/shared/api';
import {
  ArrowRightIcon,
  Button,
  EmailIcon,
  Input,
  LockIcon,
  PasswordVisibilityButton,
} from '@/shared/ui';
import { signInSchema } from '../model/sign-in.schema';
import type { SignInFormValues } from '../model/sign-in.schema';

type SignInFormProps = {
  footer?: ReactNode; // 폼 아래에 표시할 페이지 전용 보조 콘텐츠
  onSuccess: () => void; // 로그인 성공 후 페이지가 실행할 동작
};

export function SignInForm({ footer, onSuccess }: SignInFormProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const setViewer = useViewerStore((state) => state.setViewer);
  const {
    clearErrors,
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    setError,
  } = useForm<SignInFormValues>({
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: zodResolver(signInSchema),
  });

  async function handleSignIn({ email, password }: SignInFormValues) {
    clearErrors('root.server');

    try {
      const { user } = await signIn(email, password);

      setViewer(user);
      onSuccess();
    } catch (error) {
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
      onSubmit={handleSubmit(handleSignIn)}
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

      {footer}
    </form>
  );
}
