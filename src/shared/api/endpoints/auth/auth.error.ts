// Supabase Auth 오류를 화면에서 사용할 인증 도메인 오류로 변환

import { AuthError } from '@supabase/supabase-js';

// 인증 화면에서 구분해 처리할 오류 코드
export type AuthErrorCode =
  | 'invalid_credentials'
  | 'email_not_confirmed'
  | 'user_already_exists'
  | 'weak_password'
  | 'rate_limited'
  | 'unknown';

// 원본 오류를 보존하면서 앱 오류 코드와 사용자 메시지를 전달
export class AuthAppError extends Error {
  readonly code: AuthErrorCode;
  readonly cause?: unknown;

  constructor(code: AuthErrorCode, message: string, cause?: unknown) {
    super(message);
    this.name = 'AuthAppError';
    this.code = code;
    this.cause = cause;
  }
}

// Supabase 오류 코드를 사용자에게 보여줄 안전한 한국어 메시지로 변환
export function toAuthError(error: unknown): AuthAppError {
  if (error instanceof AuthAppError) return error;

  if (error instanceof AuthError) {
    if (error.code === 'invalid_credentials') {
      return new AuthAppError(
        'invalid_credentials',
        '이메일 또는 비밀번호가 올바르지 않습니다.',
        error,
      );
    }

    if (error.code === 'email_not_confirmed') {
      return new AuthAppError('email_not_confirmed', '이메일 인증을 완료해 주세요.', error);
    }

    if (error.code === 'user_already_exists') {
      return new AuthAppError('user_already_exists', '이미 가입된 이메일입니다.', error);
    }

    if (error.code === 'weak_password') {
      return new AuthAppError('weak_password', '더 안전한 비밀번호를 입력해 주세요.', error); //TODO: 비밀번호 정책 수립시 규칙에 맞는 메시지로 변경
    }

    if (
      error.code === 'over_request_rate_limit' ||
      error.code === 'over_email_send_rate_limit' ||
      error.status === 429
    ) {
      return new AuthAppError(
        'rate_limited',
        '요청이 너무 많습니다. 잠시 후 다시 시도해 주세요.',
        error,
      );
    }
  }

  return new AuthAppError(
    'unknown',
    '인증 처리 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.',
    error,
  );
}
