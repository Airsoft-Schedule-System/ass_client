// Supabase Auth 오류를 로그인 화면에서 사용할 인증 도메인 오류로 변환

import { AuthError } from '@supabase/supabase-js';

// 로그인 화면이 분기할 수 있는 최소 오류 코드
export type AuthErrorCode = 'unauthenticated' | 'unknown';

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

// 인증 호출부에서 사용하는 단일 오류 변환 진입점
export function toAuthError(error: unknown): AuthAppError {
  if (error instanceof AuthAppError) return error;

  if (error instanceof AuthError) {
    const code = error.status === 401 ? 'unauthenticated' : 'unknown';
    return new AuthAppError(code, error.message, error);
  }

  return new AuthAppError('unknown', '알 수 없는 인증 오류가 발생했습니다.', error);
}
