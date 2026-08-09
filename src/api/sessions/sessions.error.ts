// 게임 일정 API 오류를 화면에서 처리할 수 있는 도메인 오류로 변환

import { getSupabaseErrorDetails } from '@/lib/supabase/error';

export type SessionErrorCode =
  | 'unauthenticated'
  | 'permission_denied'
  | 'not_found'
  | 'invalid_input'
  | 'invalid_state'
  | 'invalid_response'
  | 'load_failed'
  | 'unknown';

// 일정 기능에서 공통으로 사용하는 안전한 오류
export class SessionAppError extends Error {
  readonly code: SessionErrorCode;
  readonly cause?: unknown;

  constructor(code: SessionErrorCode, message: string, cause?: unknown) {
    super(message);
    this.name = 'SessionAppError';
    this.code = code;
    this.cause = cause;
  }
}

// PostgreSQL RPC hint와 PostgREST 오류를 일정 도메인 코드로 변환
export function toSessionError(error: unknown): SessionAppError {
  if (error instanceof SessionAppError) return error;

  const details = getSupabaseErrorDetails(error);

  switch (details?.hint) {
    case 'unauthenticated':
      return new SessionAppError('unauthenticated', '로그인이 필요합니다.', error);
    case 'permission-denied':
      return new SessionAppError('permission_denied', '이 일정을 관리할 권한이 없습니다.', error);
    case 'not-found':
      return new SessionAppError('not_found', '게임 일정을 찾을 수 없습니다.', error);
    case 'invalid-argument':
      return new SessionAppError('invalid_input', details.message, error);
    case 'failed-precondition':
      return new SessionAppError('invalid_state', details.message, error);
  }

  if (details?.code === 'PGRST116') {
    return new SessionAppError('not_found', '게임 일정을 찾을 수 없습니다.', error);
  }

  return new SessionAppError('unknown', '게임 일정 처리 중 문제가 발생했습니다.', error);
}
