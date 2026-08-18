// Supabase SDK에서 전달되는 구조적 오류의 공통 필드를 안전하게 읽는다

export type SupabaseErrorDetails = {
  code: string | null;
  details: string | null;
  hint: string | null;
  message: string;
};

// Auth·PostgREST·Storage 오류가 공유하는 필드만 추출
export function getSupabaseErrorDetails(error: unknown): SupabaseErrorDetails | null {
  if (typeof error !== 'object' || error === null || !('message' in error)) return null;

  const message = error.message;
  if (typeof message !== 'string') return null;

  const code = 'code' in error && typeof error.code === 'string' ? error.code : null;
  const details = 'details' in error && typeof error.details === 'string' ? error.details : null;
  const hint = 'hint' in error && typeof error.hint === 'string' ? error.hint : null;

  return { code, details, hint, message };
}
