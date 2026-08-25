// 참가 신청 목록 조회와 신청·승인·취소·출석 RPC를 제공

import { z } from 'zod';
import { supabase } from '../../supabase/client';
import type { Database, Enums, Tables } from '../../supabase/database.types';
import { ParticipationAppError, toParticipationError } from './participations.error';

export type ParticipationStatus = Enums<'participation_status'>;

export type ParticipationSummary = ReturnType<typeof toParticipationSummary>;
export type SessionParticipation = ReturnType<typeof toSessionParticipation>;
export type RequestParticipationResult = z.infer<typeof requestResultSchema>;
export type JoinAsOperatorResult = z.infer<typeof joinResultSchema>;
export type ApproveParticipationResult = z.infer<typeof approveResultSchema>;
export type CancelParticipationResult = z.infer<typeof cancelResultSchema>;

const PARTICIPATION_SELECT = 'id,game_session_id,user_id,status,created_at,updated_at' as const;

type ParticipationRow = Pick<
  Tables<'participations'>,
  'id' | 'game_session_id' | 'user_id' | 'status' | 'created_at' | 'updated_at'
>;

type SessionParticipantRow =
  Database['public']['Functions']['list_session_participants']['Returns'][number];

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
  entryPassId: z.uuid(),
  newStatus: z.literal('confirmed'),
});
const cancelResultSchema = successResultSchema.extend({ refundEligible: z.boolean() });

// 참가 신청 행을 화면에서 사용하는 필드 표기로 변환
function toParticipationSummary(row: ParticipationRow) {
  return {
    id: row.id,
    gameSessionId: row.game_session_id,
    userId: row.user_id,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// 호스트 조회 정책이 적용된 RPC 행을 화면 모델로 변환
function toSessionParticipation(row: SessionParticipantRow) {
  return {
    id: row.participation_id,
    gameSessionId: row.game_session_id,
    userId: row.user_id,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    entryPassStatus: row.entry_pass_status,
    applicant: {
      id: row.user_id,
      displayName: row.display_name,
      phoneNumber: row.phone_number,
      teamId: row.team_id,
      teamName: row.team_name,
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

// 로그인 사용자의 특정 게임 참가 상태를 단건 조회
export async function findParticipationForUserAndSession(
  userId: string,
  sessionId: string,
): Promise<ParticipationSummary | null> {
  const { data, error } = await supabase
    .from('participations')
    .select(PARTICIPATION_SELECT)
    .eq('user_id', userId)
    .eq('game_session_id', sessionId)
    .maybeSingle();

  if (error) throw toParticipationError(error);
  return data ? toParticipationSummary(data) : null;
}

// 호스트 전용 RPC로 개인정보 노출 정책이 적용된 참가자 목록 조회
export async function listParticipationsBySession(
  sessionId: string,
): Promise<SessionParticipation[]> {
  const { data, error } = await supabase.rpc('list_session_participants', {
    p_session_id: sessionId,
  });

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

// 호스트 자신을 확정 참가자로 등록
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

// 호스트가 참가 신청을 승인해 참석을 확정
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

// 본인 또는 호스트가 참가 신청을 취소하고 마감 전 취소 여부 확인
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
