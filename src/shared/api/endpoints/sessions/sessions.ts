// 게임 일정의 목록·상세 조회와 생성·수정·취소 RPC를 제공

import { z } from 'zod';
import { supabase } from '../../supabase/client';
import type { Enums, Json, Tables } from '../../supabase/database.types';
import { SessionAppError, toSessionError } from './sessions.error';

export type GameSessionStatus = Enums<'game_session_status'>;

export type GameRules = Record<string, Json | undefined> & {
  muzzleVelocityFps: number;
  bbWeightGrams?: number | null;
  bioBbRequired?: boolean | null;
  magazineLimit?: number | null;
  noteBlocks?: Array<{ title: string; body: string }>;
};

export type SessionSummary = ReturnType<typeof toSessionSummary>;
export type SessionDetail = ReturnType<typeof toSessionDetail>;

type SessionFieldInput =
  { fieldId: string; fieldName?: never } | { fieldId?: never; fieldName: string };

export type CreateGameSessionInput = SessionFieldInput & {
  title: string;
  startsAt: string;
  endsAt?: string;
  hostTeamId?: string;
  capacity: number;
  gameFee: number;
  customRules: GameRules;
  presetId?: string;
  cancelDeadline?: string;
};

export type UpdateGameSessionInput = {
  title?: string;
  customRules?: GameRules;
  cancelDeadline?: string;
  capacity?: number;
  gameFee?: number;
  endsAt?: string;
};

export type CreateGameSessionResult = z.infer<typeof createResultSchema>;
export type UpdateGameSessionResult = z.infer<typeof updateResultSchema>;
export type CancelGameSessionResult = z.infer<typeof cancelResultSchema>;

const SESSION_SUMMARY_SELECT =
  'id,title,field_name,starts_at,ends_at,capacity,confirmed_count,game_fee,status,created_by_user_id,fields(name)' as const;

const SESSION_DETAIL_SELECT =
  'id,title,field_name,starts_at,ends_at,capacity,confirmed_count,game_fee,status,created_by_user_id,host_team_id,field_id,preset_id,custom_rules,cancel_deadline,created_at,updated_at,fields(name,address),game_rule_presets(name)' as const;

type SessionSummaryRow = Pick<
  Tables<'game_sessions'>,
  | 'id'
  | 'title'
  | 'field_name'
  | 'starts_at'
  | 'ends_at'
  | 'capacity'
  | 'confirmed_count'
  | 'game_fee'
  | 'status'
  | 'created_by_user_id'
> & {
  fields: Pick<Tables<'fields'>, 'name'> | null;
};

type SessionDetailRow = SessionSummaryRow &
  Pick<
    Tables<'game_sessions'>,
    | 'host_team_id'
    | 'field_id'
    | 'preset_id'
    | 'custom_rules'
    | 'cancel_deadline'
    | 'created_at'
    | 'updated_at'
  > & {
    fields: Pick<Tables<'fields'>, 'name' | 'address'> | null;
    game_rule_presets: Pick<Tables<'game_rule_presets'>, 'name'> | null;
  };

const createResultSchema = z.object({
  success: z.literal(true),
  gameSessionId: z.uuid(),
});

const updateResultSchema = z.object({
  success: z.literal(true),
  updatedFields: z.array(z.string()),
});

const cancelResultSchema = z.object({
  success: z.literal(true),
  affectedParticipations: z.number().int().nonnegative(),
});

// 필드 마스터와 직접 입력 필드명을 하나의 화면 값으로 정규화
function toSessionSummary(row: SessionSummaryRow) {
  return {
    id: row.id,
    title: row.title,
    fieldName: row.field_name ?? row.fields?.name ?? '필드 미정',
    startsAt: row.starts_at,
    endsAt: row.ends_at,
    capacity: row.capacity,
    confirmedCount: row.confirmed_count,
    gameFee: row.game_fee,
    status: row.status,
    createdByUserId: row.created_by_user_id,
  };
}

// 상세 화면에 필요한 필드·규칙 정보를 camelCase 형태로 변환
function toSessionDetail(row: SessionDetailRow) {
  return {
    ...toSessionSummary(row),
    hostTeamId: row.host_team_id,
    fieldId: row.field_id,
    fieldAddress: row.fields?.address ?? null,
    presetId: row.preset_id,
    presetName: row.game_rule_presets?.name ?? null,
    customRules: row.custom_rules,
    cancelDeadline: row.cancel_deadline,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// 활성 상태의 다가오는 일정을 시작 시각 순서로 조회
export async function listUpcomingSessions(): Promise<SessionSummary[]> {
  const { data, error } = await supabase
    .from('game_sessions')
    .select(SESSION_SUMMARY_SELECT)
    .in('status', ['recruiting', 'closed', 'inProgress'])
    .order('starts_at');

  if (error) throw toSessionError(error);
  return data.map(toSessionSummary);
}

// 로그인 사용자가 생성한 일정만 시작 시각 순서로 조회
export async function listOwnedSessions(userId: string): Promise<SessionSummary[]> {
  const { data, error } = await supabase
    .from('game_sessions')
    .select(SESSION_SUMMARY_SELECT)
    .eq('created_by_user_id', userId)
    .order('starts_at');

  if (error) throw toSessionError(error);
  return data.map(toSessionSummary);
}

// 일정 상세를 조회하고 존재하지 않으면 null 반환
export async function findSessionById(sessionId: string): Promise<SessionDetail | null> {
  const { data, error } = await supabase
    .from('game_sessions')
    .select(SESSION_DETAIL_SELECT)
    .eq('id', sessionId)
    .maybeSingle();

  if (error) throw toSessionError(error);
  return data ? toSessionDetail(data) : null;
}

// 생성 입력을 백엔드 RPC가 기대하는 camelCase JSON으로 구성
function toCreateSessionJson(input: CreateGameSessionInput): Json {
  const value: Record<string, Json | undefined> = {
    title: input.title,
    startsAt: input.startsAt,
    capacity: input.capacity,
    gameFee: input.gameFee,
    customRules: input.customRules,
  };

  if (input.endsAt !== undefined) value.endsAt = input.endsAt;
  if (input.hostTeamId !== undefined) value.hostTeamId = input.hostTeamId;
  if (input.cancelDeadline !== undefined) value.cancelDeadline = input.cancelDeadline;
  if (input.fieldId !== undefined) value.fieldId = input.fieldId;
  if (input.fieldName !== undefined) value.fieldName = input.fieldName;
  if (input.presetId !== undefined) value.presetId = input.presetId;
  return value;
}

// 수정 허용 필드만 RPC JSON으로 구성
function toUpdateSessionJson(input: UpdateGameSessionInput): Json {
  const value: Record<string, Json | undefined> = {};

  if (input.title !== undefined) value.title = input.title;
  if (input.customRules !== undefined) value.customRules = input.customRules;
  if (input.cancelDeadline !== undefined) value.cancelDeadline = input.cancelDeadline;
  if (input.capacity !== undefined) value.capacity = input.capacity;
  if (input.gameFee !== undefined) value.gameFee = input.gameFee;
  if (input.endsAt !== undefined) value.endsAt = input.endsAt;

  return value;
}

// 로그인 사용자를 호스트로 하는 새 일정 생성
export async function createGameSession(
  input: CreateGameSessionInput,
): Promise<CreateGameSessionResult> {
  const { data, error } = await supabase.rpc('create_game_session', {
    p_input: toCreateSessionJson(input),
  });

  if (error) throw toSessionError(error);

  const result = createResultSchema.safeParse(data);
  if (!result.success) {
    throw new SessionAppError(
      'invalid_response',
      '일정 생성 결과를 확인할 수 없습니다.',
      result.error,
    );
  }

  return result.data;
}

// 호스트가 백엔드에서 허용한 일정 필드만 수정
export async function updateGameSession(
  sessionId: string,
  input: UpdateGameSessionInput,
): Promise<UpdateGameSessionResult> {
  const { data, error } = await supabase.rpc('update_game_session', {
    p_session_id: sessionId,
    p_updates: toUpdateSessionJson(input),
  });

  if (error) throw toSessionError(error);

  const result = updateResultSchema.safeParse(data);
  if (!result.success) {
    throw new SessionAppError(
      'invalid_response',
      '일정 수정 결과를 확인할 수 없습니다.',
      result.error,
    );
  }

  return result.data;
}

// 일정을 취소하고 영향을 받은 참가 신청 수 반환
export async function cancelGameSession(
  sessionId: string,
  reason?: string,
): Promise<CancelGameSessionResult> {
  const { data, error } = await supabase.rpc('cancel_game_session', {
    p_session_id: sessionId,
    ...(reason === undefined ? {} : { p_reason: reason }),
  });

  if (error) throw toSessionError(error);

  const result = cancelResultSchema.safeParse(data);
  if (!result.success) {
    throw new SessionAppError(
      'invalid_response',
      '일정 취소 결과를 확인할 수 없습니다.',
      result.error,
    );
  }

  return result.data;
}
