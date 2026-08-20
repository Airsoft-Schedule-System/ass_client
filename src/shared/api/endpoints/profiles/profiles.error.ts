// 프로필 API 오류를 화면에서 처리할 수 있는 도메인 오류로 변환

import { getSupabaseErrorDetails } from '../../supabase/error';

export type ProfileErrorCode =
  | 'invalid_input'
  | 'duplicate_display_name'
  | 'not_found'
  | 'permission_denied'
  | 'load_failed'
  | 'update_failed'
  | 'unknown';

// 0016_unique_display_name 마이그레이션이 만든 제약 이름.
// Postgres는 위반한 제약 이름을 메시지나 details에 실어 보낸다.
const DISPLAY_NAME_UNIQUE_INDEX = 'users_display_name_unique';
const DISPLAY_NAME_CHECKS = ['users_display_name_not_blank', 'users_display_name_max_length'];

// 제약 이름이 message·details 중 어디에 실려 오든 찾는다
function mentionsConstraint(details: { message: string; details: string | null }, name: string) {
  return details.message.includes(name) || (details.details?.includes(name) ?? false);
}

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

  // 닉네임은 대소문자·앞뒤 공백·유니코드 정규화를 무시하고 전역 유일하다.
  if (details?.code === '23505' && mentionsConstraint(details, DISPLAY_NAME_UNIQUE_INDEX)) {
    return new ProfileAppError(
      'duplicate_display_name',
      '이미 사용 중인 닉네임입니다. 다른 닉네임을 입력해 주세요.',
      error,
    );
  }

  if (
    details?.code === '23514' &&
    DISPLAY_NAME_CHECKS.some((c) => mentionsConstraint(details, c))
  ) {
    return new ProfileAppError(
      'invalid_input',
      '닉네임은 공백 없이 20자 이내로 입력해 주세요.',
      error,
    );
  }

  if (operation === 'load') {
    return new ProfileAppError('load_failed', '프로필을 불러오지 못했습니다.', error);
  }

  if (operation === 'update') {
    return new ProfileAppError('update_failed', '프로필을 저장하지 못했습니다.', error);
  }

  return new ProfileAppError('unknown', '프로필 처리 중 문제가 발생했습니다.', error);
}
