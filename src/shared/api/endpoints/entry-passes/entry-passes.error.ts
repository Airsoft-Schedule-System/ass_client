// QR 입장권 API 오류를 화면에서 처리할 수 있는 도메인 오류로 변환

import { getSupabaseErrorDetails } from '../../supabase/error';

export type EntryPassErrorCode =
  | 'unauthenticated'
  | 'permission_denied'
  | 'not_found'
  | 'invalid_input'
  | 'invalid_state'
  | 'invalid_response'
  | 'load_failed'
  | 'unknown';

// QR 표시와 스캔 화면에서 공통으로 사용하는 안전한 오류
export class EntryPassAppError extends Error {
  readonly code: EntryPassErrorCode;
  readonly cause?: unknown;

  constructor(code: EntryPassErrorCode, message: string, cause?: unknown) {
    super(message);
    this.name = 'EntryPassAppError';
    this.code = code;
    this.cause = cause;
  }
}

// PostgreSQL RPC hint를 QR 입장권 도메인 오류로 변환
export function toEntryPassError(error: unknown, operation: 'load' | 'rpc'): EntryPassAppError {
  if (error instanceof EntryPassAppError) return error;

  const details = getSupabaseErrorDetails(error);

  switch (details?.hint) {
    case 'unauthenticated':
      return new EntryPassAppError('unauthenticated', '로그인이 필요합니다.', error);
    case 'permission-denied':
      return new EntryPassAppError('permission_denied', '입장권을 처리할 권한이 없습니다.', error);
    case 'not-found':
      return new EntryPassAppError('not_found', '사용 가능한 입장권을 찾을 수 없습니다.', error);
    case 'invalid-argument':
      return new EntryPassAppError('invalid_input', details.message, error);
    case 'failed-precondition':
      return new EntryPassAppError('invalid_state', details.message, error);
  }

  if (operation === 'load') {
    return new EntryPassAppError('load_failed', '입장권을 불러오지 못했습니다.', error);
  }

  return new EntryPassAppError('unknown', '입장권 처리 중 문제가 발생했습니다.', error);
}
