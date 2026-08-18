// 프로필 API 오류를 화면에서 처리할 수 있는 도메인 오류로 변환

import { getSupabaseErrorDetails } from '../../supabase/error';

export type ProfileErrorCode =
  'invalid_input' | 'not_found' | 'permission_denied' | 'load_failed' | 'update_failed' | 'unknown';

// 프로필 화면에 안전한 코드와 메시지를 제공
export class ProfileAppError extends Error {
  readonly code: ProfileErrorCode;
  readonly cause?: unknown;

  constructor(code: ProfileErrorCode, message: string, cause?: unknown) {
    super(message);
    this.name = 'ProfileAppError';
    this.code = code;
    this.cause = cause;
  }
}

// Supabase 권한·조회 오류를 프로필 도메인 의미로 변환
export function toProfileError(error: unknown, operation: 'load' | 'update'): ProfileAppError {
  if (error instanceof ProfileAppError) return error;

  const details = getSupabaseErrorDetails(error);

  if (details?.hint === 'not-found' || details?.code === 'PGRST116') {
    return new ProfileAppError('not_found', '사용자 프로필을 찾을 수 없습니다.', error);
  }

  if (details?.hint === 'permission-denied' || details?.code === '42501') {
    return new ProfileAppError('permission_denied', '프로필을 변경할 권한이 없습니다.', error);
  }

  if (operation === 'load') {
    return new ProfileAppError('load_failed', '프로필을 불러오지 못했습니다.', error);
  }

  if (operation === 'update') {
    return new ProfileAppError('update_failed', '프로필을 저장하지 못했습니다.', error);
  }

  return new ProfileAppError('unknown', '프로필 처리 중 문제가 발생했습니다.', error);
}
