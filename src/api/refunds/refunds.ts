// 환불 요청 조회와 암호화 계좌 접수 RPC를 제공

import { z } from 'zod';
import { RefundAppError, toRefundError } from '@/api/refunds/refunds.error';
import { supabase } from '@/lib/supabase/client';
import type { Enums, Tables } from '@/lib/supabase/database.types';

export type RefundRequestStatus = Enums<'refund_request_status'>;

export type RefundRequest = ReturnType<typeof toRefundRequest>;

export type RequestRefundInput = {
  participationId: string;
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  reason?: string;
};

export type RequestRefundResult = z.infer<typeof requestResultSchema>;

const REFUND_SELECT =
  'id,participation_id,game_session_id,user_id,bank_name,account_holder,reason,status,requested_at,processed_by,processed_at,note' as const;

type RefundRequestRow = Pick<
  Tables<'refund_requests'>,
  | 'id'
  | 'participation_id'
  | 'game_session_id'
  | 'user_id'
  | 'bank_name'
  | 'account_holder'
  | 'reason'
  | 'status'
  | 'requested_at'
  | 'processed_by'
  | 'processed_at'
  | 'note'
>;

const requestResultSchema = z.object({
  success: z.literal(true),
  refundRequestId: z.uuid(),
});

// 암호화 계좌번호를 제외한 환불 요청 공개 필드를 앱 표기로 변환
function toRefundRequest(row: RefundRequestRow) {
  return {
    id: row.id,
    participationId: row.participation_id,
    gameSessionId: row.game_session_id,
    userId: row.user_id,
    bankName: row.bank_name,
    accountHolder: row.account_holder,
    reason: row.reason,
    status: row.status,
    requestedAt: row.requested_at,
    processedBy: row.processed_by,
    processedAt: row.processed_at,
    note: row.note,
  };
}

// 참가 신청에 연결된 환불 요청 조회
export async function findRefundRequestByParticipation(
  participationId: string,
): Promise<RefundRequest | null> {
  const { data, error } = await supabase
    .from('refund_requests')
    .select(REFUND_SELECT)
    .eq('participation_id', participationId)
    .maybeSingle();

  if (error) throw toRefundError(error, 'load');
  return data ? toRefundRequest(data) : null;
}

// 일정 호스트가 관리할 환불 요청 목록을 최신순으로 조회
export async function listRefundRequestsBySession(sessionId: string): Promise<RefundRequest[]> {
  const { data, error } = await supabase
    .from('refund_requests')
    .select(REFUND_SELECT)
    .eq('game_session_id', sessionId)
    .order('requested_at', { ascending: false });

  if (error) throw toRefundError(error, 'load');
  return data.map(toRefundRequest);
}

// 취소된 확정 참가의 환불 계좌를 서버에서 암호화해 접수
export async function requestRefund(input: RequestRefundInput): Promise<RequestRefundResult> {
  const { data, error } = await supabase.rpc('request_refund', {
    p_participation_id: input.participationId,
    p_bank_name: input.bankName,
    p_account_number: input.accountNumber,
    p_account_holder: input.accountHolder,
    ...(input.reason === undefined ? {} : { p_reason: input.reason }),
  });

  if (error) throw toRefundError(error, 'rpc');

  const result = requestResultSchema.safeParse(data);
  if (!result.success) {
    throw new RefundAppError(
      'invalid_response',
      '환불 요청 결과를 확인할 수 없습니다.',
      result.error,
    );
  }

  return result.data;
}
