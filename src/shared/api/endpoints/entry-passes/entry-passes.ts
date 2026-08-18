// QR 입장권 상태 조회와 토큰 발급·스캔 RPC를 제공

import { z } from 'zod';
import { supabase } from '../../supabase/client';
import type { Enums, Tables } from '../../supabase/database.types';
import { EntryPassAppError, toEntryPassError } from './entry-passes.error';

export type EntryPassStatus = Enums<'entry_pass_status'>;

export type EntryPass = ReturnType<typeof toEntryPass>;

export type EntryPassToken = z.infer<typeof tokenResultSchema>;

export type ScanEntryPassResult = z.infer<typeof scanResultSchema>;

const ENTRY_PASS_SELECT =
  'id,participation_id,game_session_id,user_id,status,issued_at,expires_at,used_at,scanned_by' as const;

type EntryPassRow = Pick<
  Tables<'entry_passes'>,
  | 'id'
  | 'participation_id'
  | 'game_session_id'
  | 'user_id'
  | 'status'
  | 'issued_at'
  | 'expires_at'
  | 'used_at'
  | 'scanned_by'
>;

const tokenResultSchema = z.object({
  entryPassId: z.uuid(),
  token: z.string().min(1),
  expiresAt: z.string().min(1),
});

const scanResultSchema = z.object({
  success: z.literal(true),
  userId: z.uuid(),
  displayName: z.string(),
});

// 입장권 행에서 토큰 해시와 비밀 버전을 제외하고 앱 표기로 변환
function toEntryPass(row: EntryPassRow) {
  return {
    id: row.id,
    participationId: row.participation_id,
    gameSessionId: row.game_session_id,
    userId: row.user_id,
    status: row.status,
    issuedAt: row.issued_at,
    expiresAt: row.expires_at,
    usedAt: row.used_at,
    scannedBy: row.scanned_by,
  };
}

// 참가 신청에 연결된 가장 최근 입장권 상태 조회
export async function findEntryPassByParticipation(
  participationId: string,
): Promise<EntryPass | null> {
  const { data, error } = await supabase
    .from('entry_passes')
    .select(ENTRY_PASS_SELECT)
    .eq('participation_id', participationId)
    .order('issued_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw toEntryPassError(error, 'load');
  return data ? toEntryPass(data) : null;
}

// 확정 참가자가 QR에 표시할 서명 토큰 발급
export async function getEntryPassToken(sessionId: string): Promise<EntryPassToken> {
  const { data, error } = await supabase.rpc('get_entry_pass_token', {
    p_session_id: sessionId,
  });

  if (error) throw toEntryPassError(error, 'rpc');

  const result = tokenResultSchema.safeParse(data);
  if (!result.success) {
    throw new EntryPassAppError(
      'invalid_response',
      '입장권 토큰을 확인할 수 없습니다.',
      result.error,
    );
  }

  return result.data;
}

// 호스트가 QR 토큰을 검증하고 참가자를 출석 처리
export async function scanEntryPass(
  entryPassId: string,
  token: string,
): Promise<ScanEntryPassResult> {
  const { data, error } = await supabase.rpc('scan_entry_pass', {
    p_entry_pass_id: entryPassId,
    p_token: token,
  });

  if (error) throw toEntryPassError(error, 'rpc');

  const result = scanResultSchema.safeParse(data);
  if (!result.success) {
    throw new EntryPassAppError(
      'invalid_response',
      'QR 스캔 결과를 확인할 수 없습니다.',
      result.error,
    );
  }

  return result.data;
}
