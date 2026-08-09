// 환불 요청 API 오류를 화면에서 처리할 수 있는 도메인 오류로 변환

import { getSupabaseErrorDetails } from '@/lib/supabase/error';

export type RefundErrorCode =
  | 'unauthenticated'
  | 'permission_denied'
  | 'not_found'
  | 'already_exists'
  | 'invalid_input'
  | 'invalid_state'
  | 'invalid_response'
  | 'load_failed'
  | 'unknown';

// 환불 요청 화면에서 공통으로 사용하는 안전한 오류
export class RefundAppError extends Error {
  readonly code: RefundErrorCode;
  readonly cause?: unknown;

  constructor(code: RefundErrorCode, message: string, cause?: unknown) {
    super(message);
    this.name = 'RefundAppError';
    this.code = code;
    this.cause = cause;
  }
}

// PostgreSQL RPC hint를 환불 요청 도메인 오류로 변환
export function toRefundError(error: unknown, operation: 'load' | 'rpc'): RefundAppError {
  if (error instanceof RefundAppError) return error;

  const details = getSupabaseErrorDetails(error);

  switch (details?.hint) {
    case 'unauthenticated':
      return new RefundAppError('unauthenticated', '로그인이 필요합니다.', error);
    case 'permission-denied':
      return new RefundAppError('permission_denied', '환불 요청을 처리할 권한이 없습니다.', error);
    case 'not-found':
      return new RefundAppError('not_found', '환불 대상 참가 신청을 찾을 수 없습니다.', error);
    case 'already-exists':
      return new RefundAppError('already_exists', '이미 환불 요청이 접수되었습니다.', error);
    case 'invalid-argument':
      return new RefundAppError('invalid_input', details.message, error);
    case 'failed-precondition':
      return new RefundAppError('invalid_state', details.message, error);
  }

  if (operation === 'load') {
    return new RefundAppError('load_failed', '환불 요청을 불러오지 못했습니다.', error);
  }

  return new RefundAppError('unknown', '환불 요청 처리 중 문제가 발생했습니다.', error);
}
