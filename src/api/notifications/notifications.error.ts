// 인앱 알림 API 오류를 화면에서 처리할 수 있는 도메인 오류로 변환

export type NotificationErrorCode = 'load_failed' | 'update_failed' | 'unknown';

// 알림 목록과 읽음 처리에서 사용하는 안전한 오류
export class NotificationAppError extends Error {
  readonly code: NotificationErrorCode;
  readonly cause?: unknown;

  constructor(code: NotificationErrorCode, message: string, cause?: unknown) {
    super(message);
    this.name = 'NotificationAppError';
    this.code = code;
    this.cause = cause;
  }
}

// Supabase 조회·수정 실패를 알림 도메인 메시지로 변환
export function toNotificationError(
  error: unknown,
  operation: 'load' | 'update',
): NotificationAppError {
  if (error instanceof NotificationAppError) return error;

  if (operation === 'load') {
    return new NotificationAppError('load_failed', '알림을 불러오지 못했습니다.', error);
  }

  if (operation === 'update') {
    return new NotificationAppError(
      'update_failed',
      '알림 읽음 상태를 저장하지 못했습니다.',
      error,
    );
  }

  return new NotificationAppError('unknown', '알림 처리 중 문제가 발생했습니다.', error);
}
