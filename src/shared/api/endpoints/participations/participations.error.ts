// 참가 신청 API 오류를 화면에서 처리할 수 있는 도메인 오류로 변환

import { getSupabaseErrorDetails } from '../../supabase/error';

export type ParticipationErrorCode =
  | 'unauthenticated'
  | 'permission_denied'
  | 'not_found'
  | 'already_exists'
  | 'capacity_filled'
  | 'invalid_input'
  | 'invalid_state'
  | 'unsupported_status'
  | 'invalid_response'
  | 'unknown';

// 참가 신청 흐름 전반에서 사용하는 안전한 오류
export class ParticipationAppError extends Error {
  readonly code: ParticipationErrorCode;
  readonly cause?: unknown;

  constructor(code: ParticipationErrorCode, message: string, cause?: unknown) {
    super(message);
    this.name = 'ParticipationAppError';
    this.code = code;
    this.cause = cause;
  }
}

// PostgreSQL RPC hint를 참가 신청 화면에서 사용하는 오류로 변환
export function toParticipationError(error: unknown): ParticipationAppError {
  if (error instanceof ParticipationAppError) return error;

  const details = getSupabaseErrorDetails(error);

  if (details?.details === 'capacityFilled') {
    return new ParticipationAppError('capacity_filled', '참가 정원이 마감되었습니다.', error);
  }

  switch (details?.hint) {
    case 'unauthenticated':
      return new ParticipationAppError('unauthenticated', '로그인이 필요합니다.', error);
    case 'permission-denied':
      return new ParticipationAppError(
        'permission_denied',
        '참가 신청을 처리할 권한이 없습니다.',
        error,
      );
    case 'not-found':
      return new ParticipationAppError('not_found', '참가 신청을 찾을 수 없습니다.', error);
    case 'already-exists':
      return new ParticipationAppError(
        'already_exists',
        '이미 이 게임에 참가 신청했습니다.',
        error,
      );
    case 'invalid-argument':
      return new ParticipationAppError('invalid_input', details.message, error);
    case 'failed-precondition':
      return new ParticipationAppError('invalid_state', details.message, error);
  }

  return new ParticipationAppError('unknown', '참가 신청 처리 중 문제가 발생했습니다.', error);
}
