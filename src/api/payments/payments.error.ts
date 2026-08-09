// 결제·송금증 API 오류를 화면에서 처리할 수 있는 도메인 오류로 변환

import { getSupabaseErrorDetails } from '@/lib/supabase/error';

export type PaymentErrorCode =
  | 'unauthenticated'
  | 'permission_denied'
  | 'not_found'
  | 'invalid_input'
  | 'invalid_file'
  | 'invalid_state'
  | 'capacity_filled'
  | 'invalid_response'
  | 'load_failed'
  | 'upload_failed'
  | 'unknown';

export type PaymentOperation = 'load' | 'upload' | 'rpc';

// 결제와 송금증 화면에서 공통으로 사용하는 안전한 오류
export class PaymentAppError extends Error {
  readonly code: PaymentErrorCode;
  readonly cause?: unknown;

  constructor(code: PaymentErrorCode, message: string, cause?: unknown) {
    super(message);
    this.name = 'PaymentAppError';
    this.code = code;
    this.cause = cause;
  }
}

// Storage·PostgREST·RPC 오류를 결제 흐름의 의미로 변환
export function toPaymentError(error: unknown, operation: PaymentOperation): PaymentAppError {
  if (error instanceof PaymentAppError) return error;

  const details = getSupabaseErrorDetails(error);

  if (details?.hint === 'failed-precondition' && details.details === 'capacityFilled') {
    return new PaymentAppError('capacity_filled', '참가 정원이 마감되었습니다.', error);
  }

  switch (details?.hint) {
    case 'unauthenticated':
      return new PaymentAppError('unauthenticated', '로그인이 필요합니다.', error);
    case 'permission-denied':
      return new PaymentAppError('permission_denied', '송금증을 처리할 권한이 없습니다.', error);
    case 'not-found':
      return new PaymentAppError('not_found', '결제 제출 내역을 찾을 수 없습니다.', error);
    case 'invalid-argument':
      return new PaymentAppError('invalid_input', details.message, error);
    case 'failed-precondition':
      return new PaymentAppError('invalid_state', details.message, error);
  }

  if (operation === 'load') {
    return new PaymentAppError('load_failed', '결제 정보를 불러오지 못했습니다.', error);
  }

  if (operation === 'upload') {
    return new PaymentAppError('upload_failed', '송금증 파일을 처리하지 못했습니다.', error);
  }

  return new PaymentAppError('unknown', '결제 처리 중 문제가 발생했습니다.', error);
}
