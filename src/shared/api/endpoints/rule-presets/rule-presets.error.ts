// 게임 규칙 프리셋 API 오류를 화면에서 처리할 수 있는 도메인 오류로 변환

import { getSupabaseErrorDetails } from '../../supabase/error';

export type RulePresetErrorCode =
  | 'permission_denied'
  | 'not_found'
  | 'invalid_input'
  | 'load_failed'
  | 'save_failed'
  | 'delete_failed'
  | 'unknown';

// 게임 규칙 프리셋 화면에서 사용하는 안전한 오류
export class RulePresetAppError extends Error {
  readonly code: RulePresetErrorCode;
  readonly cause?: unknown;

  constructor(code: RulePresetErrorCode, message: string, cause?: unknown) {
    super(message);
    this.name = 'RulePresetAppError';
    this.code = code;
    this.cause = cause;
  }
}

// PostgREST 권한 오류와 작업 종류를 프리셋 도메인 오류로 변환
export function toRulePresetError(
  error: unknown,
  operation: 'load' | 'save' | 'delete',
): RulePresetAppError {
  if (error instanceof RulePresetAppError) return error;

  const details = getSupabaseErrorDetails(error);

  if (details?.code === '42501') {
    return new RulePresetAppError(
      'permission_denied',
      '이 게임 규칙을 변경할 권한이 없습니다.',
      error,
    );
  }

  if (details?.code === 'PGRST116') {
    return new RulePresetAppError('not_found', '게임 규칙 프리셋을 찾을 수 없습니다.', error);
  }

  if (operation === 'load') {
    return new RulePresetAppError('load_failed', '게임 규칙을 불러오지 못했습니다.', error);
  }

  if (operation === 'save') {
    return new RulePresetAppError('save_failed', '게임 규칙을 저장하지 못했습니다.', error);
  }

  if (operation === 'delete') {
    return new RulePresetAppError('delete_failed', '게임 규칙을 삭제하지 못했습니다.', error);
  }

  return new RulePresetAppError('unknown', '게임 규칙 처리 중 문제가 발생했습니다.', error);
}
