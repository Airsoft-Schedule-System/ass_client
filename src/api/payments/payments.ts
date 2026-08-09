// 결제 제출 조회와 송금증 Storage 업로드·검수·반려 RPC를 제공

import { z } from 'zod';
import { PaymentAppError, toPaymentError } from '@/api/payments/payments.error';
import { supabase } from '@/lib/supabase/client';
import type { Enums, Tables } from '@/lib/supabase/database.types';

export type PaymentSubmissionStatus = Enums<'payment_submission_status'>;

export type PaymentSubmission = {
  id: string;
  participationId: string;
  gameSessionId: string;
  userId: string;
  senderName: string;
  amount: number;
  receiptPath: string;
  status: PaymentSubmissionStatus;
  submittedAt: string;
  reviewedBy: string | null;
  reviewedAt: string | null;
  rejectionReason: string | null;
};

export type SubmitPaymentInput = {
  participationId: string;
  senderName: string;
  amount: number;
  receiptFile: File;
};

export type SubmitPaymentResult = {
  success: true;
  paymentSubmissionId: string;
};

const PAYMENT_SELECT =
  'id,participation_id,game_session_id,user_id,sender_name,amount,receipt_path,status,submitted_at,reviewed_by,reviewed_at,rejection_reason' as const;
const RECEIPT_BUCKET = 'receipts';
const MAX_RECEIPT_SIZE = 5 * 1024 * 1024;
const RECEIPT_EXTENSIONS = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
} as const;

type PaymentSubmissionRow = Pick<
  Tables<'payment_submissions'>,
  | 'id'
  | 'participation_id'
  | 'game_session_id'
  | 'user_id'
  | 'sender_name'
  | 'amount'
  | 'receipt_path'
  | 'status'
  | 'submitted_at'
  | 'reviewed_by'
  | 'reviewed_at'
  | 'rejection_reason'
>;

const successResultSchema = z.object({ success: z.literal(true) });
const submitResultSchema = successResultSchema.extend({ paymentSubmissionId: z.uuid() });

// 결제 제출 행의 DB 컬럼을 앱 도메인 표기로 변환
function toPaymentSubmission(row: PaymentSubmissionRow): PaymentSubmission {
  return {
    id: row.id,
    participationId: row.participation_id,
    gameSessionId: row.game_session_id,
    userId: row.user_id,
    senderName: row.sender_name,
    amount: row.amount,
    receiptPath: row.receipt_path,
    status: row.status,
    submittedAt: row.submitted_at,
    reviewedBy: row.reviewed_by,
    reviewedAt: row.reviewed_at,
    rejectionReason: row.rejection_reason,
  };
}

// 송금증 정책에 맞는 확장자를 검증하고 Storage 경로 생성
function createReceiptPath(participationId: string, file: File): string {
  const extension = RECEIPT_EXTENSIONS[file.type as keyof typeof RECEIPT_EXTENSIONS];

  if (!extension) {
    throw new PaymentAppError('invalid_file', 'JPEG, PNG 또는 WebP 송금증만 첨부할 수 있습니다.');
  }

  if (file.size > MAX_RECEIPT_SIZE) {
    throw new PaymentAppError('invalid_file', '송금증 파일은 5MB 이하여야 합니다.');
  }

  return `receipts/${participationId}/receipt-${Date.now()}-${crypto.randomUUID()}.${extension}`;
}

// 일정 호스트가 확인할 송금증 제출 목록을 최신순으로 조회
export async function listPaymentSubmissionsBySession(
  sessionId: string,
): Promise<PaymentSubmission[]> {
  const { data, error } = await supabase
    .from('payment_submissions')
    .select(PAYMENT_SELECT)
    .eq('game_session_id', sessionId)
    .order('submitted_at', { ascending: false });

  if (error) throw toPaymentError(error, 'load');
  return data.map(toPaymentSubmission);
}

// 참가 신청의 가장 최근 송금증 제출 내역 조회
export async function findLatestPaymentSubmissionByParticipation(
  participationId: string,
): Promise<PaymentSubmission | null> {
  const { data, error } = await supabase
    .from('payment_submissions')
    .select(PAYMENT_SELECT)
    .eq('participation_id', participationId)
    .order('submitted_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw toPaymentError(error, 'load');
  return data ? toPaymentSubmission(data) : null;
}

// RLS로 열람 권한을 확인한 뒤 1분간 유효한 송금증 URL 생성
export async function createReceiptSignedUrl(receiptPath: string): Promise<string> {
  const { data, error } = await supabase.storage
    .from(RECEIPT_BUCKET)
    .createSignedUrl(receiptPath, 60);

  if (error) throw toPaymentError(error, 'load');
  return data.signedUrl;
}

// 송금증 업로드 후 결제 RPC를 호출해 참가를 즉시 확정
export async function submitPayment(input: SubmitPaymentInput): Promise<SubmitPaymentResult> {
  const receiptPath = createReceiptPath(input.participationId, input.receiptFile);
  const { error: uploadError } = await supabase.storage
    .from(RECEIPT_BUCKET)
    .upload(receiptPath, input.receiptFile, {
      cacheControl: '3600',
      contentType: input.receiptFile.type,
      upsert: false,
    });

  if (uploadError) throw toPaymentError(uploadError, 'upload');

  const { data, error } = await supabase.rpc('submit_payment', {
    p_participation_id: input.participationId,
    p_sender_name: input.senderName,
    p_amount: input.amount,
    p_receipt_path: receiptPath,
  });

  if (error) throw toPaymentError(error, 'rpc');

  const result = submitResultSchema.safeParse(data);
  if (!result.success) {
    throw new PaymentAppError(
      'invalid_response',
      '송금증 제출 결과를 확인할 수 없습니다.',
      result.error,
    );
  }

  return result.data;
}

// 호스트가 송금증을 확인했다는 비관문 검수 마커 기록
export async function markPaymentReviewed(submissionId: string): Promise<void> {
  const { data, error } = await supabase.rpc('mark_payment_reviewed', {
    p_submission_id: submissionId,
  });

  if (error) throw toPaymentError(error, 'rpc');

  const result = successResultSchema.safeParse(data);
  if (!result.success) {
    throw new PaymentAppError(
      'invalid_response',
      '송금증 검수 결과를 확인할 수 없습니다.',
      result.error,
    );
  }
}

// 호스트가 송금증을 사후 반려하고 참가를 입금 대기로 되돌림
export async function rejectPayment(submissionId: string, reason: string): Promise<void> {
  const { data, error } = await supabase.rpc('reject_payment', {
    p_submission_id: submissionId,
    p_reason: reason,
  });

  if (error) throw toPaymentError(error, 'rpc');

  const result = successResultSchema.safeParse(data);
  if (!result.success) {
    throw new PaymentAppError(
      'invalid_response',
      '송금증 반려 결과를 확인할 수 없습니다.',
      result.error,
    );
  }
}
