// 팀·필드 기준 데이터 API 오류를 화면에서 처리할 수 있는 도메인 오류로 변환

export type CatalogErrorCode = 'load_failed' | 'unknown';

// 기준 데이터 선택 화면에서 사용하는 안전한 오류
export class CatalogAppError extends Error {
  readonly code: CatalogErrorCode;
  readonly cause?: unknown;

  constructor(code: CatalogErrorCode, message: string, cause?: unknown) {
    super(message);
    this.name = 'CatalogAppError';
    this.code = code;
    this.cause = cause;
  }
}

// Supabase 조회 실패를 기준 데이터 도메인 메시지로 변환
export function toCatalogError(error: unknown): CatalogAppError {
  if (error instanceof CatalogAppError) return error;
  return new CatalogAppError('load_failed', '기준 정보를 불러오지 못했습니다.', error);
}
