// 참가 신청 목록 조회와 신청·승인·취소·출석 RPC를 제공

import { z } from 'zod';
import {
  ParticipationAppError,
  toParticipationError,
} from '@/api/participations/participations.error';
import { supabase } from '@/lib/supabase/client';
import type { Enums, Tables } from '@/lib/supabase/database.types';

type DatabaseParticipationStatus = Enums<'participation_status'>;
export type ParticipationStatus = Exclude<DatabaseParticipationStatus, 'paymentReview'>;

export type ParticipationSummary = ReturnType<typeof toParticipationSummary>;
export type SessionParticipation = ReturnType<typeof toSessionParticipation>;
export type RequestParticipationResult = z.infer<typeof requestResultSchema>;
export type JoinAsOperatorResult = z.infer<typeof joinResultSchema>;
export type ApproveParticipationResult = z.infer<typeof approveResultSchema>;
export type CancelParticipationResult = z.infer<typeof cancelResultSchema>;

const PARTICIPATION_SELECT = 'id,game_session_id,user_id,status,created_at,updated_at' as const;
const SESSION_PARTICIPATION_SELECT =
  'id,game_session_id,user_id,status,created_at,updated_at,users(id,display_name,email,phone_number,team_id)' as const;

type ParticipationRow = Pick<
  Tables<'participations'>,
  'id' | 'game_session_id' | 'user_id' | 'status' | 'created_at' | 'updated_at'
>;

type SessionParticipationRow = ParticipationRow & {
  users: Pick<Tables<'users'>, 'id' | 'display_name' | 'email' | 'phone_number' | 'team_id'>;
};

const successResultSchema = z.object({ success: z.literal(true) });
const requestResultSchema = successResultSchema.extend({
  participationId: z.uuid(),
  status: z.literal('pendingApproval'),
});
const joinResultSchema = successResultSchema.extend({
  participationId: z.uuid(),
  status: z.literal('confirmed'),
});
const approveResultSchema = successResultSchema.extend({
  newStatus: z.literal('awaitingPayment'),
});
const cancelResultSchema = successResultSchema.extend({ refundEligible: z.boolean() });

// DB에 호환용으로 남은 paymentReview 상태가 화면으로 유출되지 않게 차단
function toParticipationStatus(status: DatabaseParticipationStatus): ParticipationStatus {
  if (status === 'paymentReview') {
    throw new ParticipationAppError(
      'unsupported_status',
      '지원하지 않는 이전 참가 상태가 포함되어 있습니다.',
    );
  }

  return status;
}

// 참가 신청 행을 화면에서 사용하는 필드 표기로 변환
function toParticipationSummary(row: ParticipationRow) {
  return {
    id: row.id,
    gameSessionId: row.game_session_id,
    userId: row.user_id,
    status: toParticipationStatus(row.status),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// 호스트 목록에 신청자 프로필을 함께 제공
function toSessionParticipation(row: SessionParticipationRow) {
  return {
    ...toParticipationSummary(row),
    applicant: {
      id: row.users.id,
      displayName: row.users.display_name,
      email: row.users.email,
      phoneNumber: row.users.phone_number,
      teamId: row.users.team_id,
    },
  };
}

// 사용자의 전체 참가 신청을 최신 생성순으로 조회
export async function listParticipationsForUser(userId: string): Promise<ParticipationSummary[]> {
  const { data, error } = await supabase
    .from('participations')
    .select(PARTICIPATION_SELECT)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw toParticipationError(error);
  return data.map(toParticipationSummary);
}

// 호스트가 관리하는 일정의 참가 신청과 신청자 프로필 조회
export async function listParticipationsBySession(
  sessionId: string,
): Promise<SessionParticipation[]> {
  const { data, error } = await supabase
    .from('participations')
    .select(SESSION_PARTICIPATION_SELECT)
    .eq('game_session_id', sessionId)
    .order('created_at');

  if (error) throw toParticipationError(error);
  return data.map(toSessionParticipation);
}

// 로그인 사용자의 참가 신청 생성
export async function requestParticipation(sessionId: string): Promise<RequestParticipationResult> {
  const { data, error } = await supabase.rpc('request_participation', {
    p_session_id: sessionId,
  });

  if (error) throw toParticipationError(error);

  const result = requestResultSchema.safeParse(data);
  if (!result.success) {
    throw new ParticipationAppError(
      'invalid_response',
      '참가 신청 결과를 확인할 수 없습니다.',
      result.error,
    );
  }

  return result.data;
}

// 호스트 자신을 결제 없이 확정 참가자로 등록
export async function joinAsOperator(sessionId: string): Promise<JoinAsOperatorResult> {
  const { data, error } = await supabase.rpc('join_as_operator', {
    p_session_id: sessionId,
  });

  if (error) throw toParticipationError(error);

  const result = joinResultSchema.safeParse(data);
  if (!result.success) {
    throw new ParticipationAppError(
      'invalid_response',
      '호스트 참가 결과를 확인할 수 없습니다.',
      result.error,
    );
  }

  return result.data;
}

// 호스트가 참가 신청을 승인해 입금 대기 상태로 변경
export async function approveParticipation(
  participationId: string,
): Promise<ApproveParticipationResult> {
  const { data, error } = await supabase.rpc('approve_participation', {
    p_participation_id: participationId,
  });

  if (error) throw toParticipationError(error);

  const result = approveResultSchema.safeParse(data);
  if (!result.success) {
    throw new ParticipationAppError(
      'invalid_response',
      '참가 승인 결과를 확인할 수 없습니다.',
      result.error,
    );
  }

  return result.data;
}

// 호스트가 승인 대기 중인 참가 신청을 반려
export async function rejectParticipation(participationId: string, reason?: string): Promise<void> {
  const { data, error } = await supabase.rpc('reject_participation', {
    p_participation_id: participationId,
    ...(reason === undefined ? {} : { p_reason: reason }),
  });

  if (error) throw toParticipationError(error);

  const result = successResultSchema.safeParse(data);
  if (!result.success) {
    throw new ParticipationAppError(
      'invalid_response',
      '참가 반려 결과를 확인할 수 없습니다.',
      result.error,
    );
  }
}

// 본인 또는 호스트가 참가 신청을 취소하고 환불 가능 여부 확인
export async function cancelParticipation(
  participationId: string,
  reason?: string,
): Promise<CancelParticipationResult> {
  const { data, error } = await supabase.rpc('cancel_participation', {
    p_participation_id: participationId,
    ...(reason === undefined ? {} : { p_reason: reason }),
  });

  if (error) throw toParticipationError(error);

  const result = cancelResultSchema.safeParse(data);
  if (!result.success) {
    throw new ParticipationAppError(
      'invalid_response',
      '참가 취소 결과를 확인할 수 없습니다.',
      result.error,
    );
  }

  return result.data;
}

// QR 사용이 어려운 참가자를 호스트가 수동 출석 처리
export async function markAttendance(participationId: string): Promise<void> {
  const { data, error } = await supabase.rpc('mark_attendance', {
    p_participation_id: participationId,
  });

  if (error) throw toParticipationError(error);

  const result = successResultSchema.safeParse(data);
  if (!result.success) {
    throw new ParticipationAppError(
      'invalid_response',
      '출석 처리 결과를 확인할 수 없습니다.',
      result.error,
    );
  }
}
