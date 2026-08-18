// 로그인 사용자의 앱 프로필 조회와 수정을 제공

import { supabase } from '../../supabase/client';
import type { Tables, TablesUpdate } from '../../supabase/database.types';
import { ProfileAppError, toProfileError } from './profiles.error';

export type UserProfile = ReturnType<typeof toUserProfile>;

export type UpdateProfileInput = {
  displayName?: string;
  phoneNumber?: string | null;
  teamId?: string | null;
};

const PROFILE_SELECT =
  'id,email,display_name,phone_number,team_id,created_at,last_active_at,teams(name)' as const;

type ProfileRow = Pick<
  Tables<'users'>,
  'id' | 'email' | 'display_name' | 'phone_number' | 'team_id' | 'created_at' | 'last_active_at'
> & {
  teams: Pick<Tables<'teams'>, 'name'> | null;
};

// DB 컬럼 표기를 앱 도메인의 camelCase 형태로 제한
function toUserProfile(row: ProfileRow) {
  return {
    id: row.id,
    email: row.email,
    displayName: row.display_name,
    phoneNumber: row.phone_number,
    teamId: row.team_id,
    teamName: row.teams?.name ?? null,
    createdAt: row.created_at,
    lastActiveAt: row.last_active_at,
  };
}

// RLS로 허용된 현재 사용자의 프로필 조회
export async function getMyProfile(userId: string): Promise<UserProfile> {
  const { data, error } = await supabase
    .from('users')
    .select(PROFILE_SELECT)
    .eq('id', userId)
    .maybeSingle();

  if (error) throw toProfileError(error, 'load');
  if (!data) {
    throw new ProfileAppError('not_found', '사용자 프로필을 찾을 수 없습니다.');
  }

  return toUserProfile(data);
}

// RLS가 허용한 프로필 컬럼만 갱신하고 최신 프로필 반환
export async function updateMyProfile(
  userId: string,
  input: UpdateProfileInput,
): Promise<UserProfile> {
  const updates: TablesUpdate<'users'> = {};

  if (input.displayName !== undefined) updates.display_name = input.displayName.trim();
  if (input.phoneNumber !== undefined) updates.phone_number = input.phoneNumber;
  if (input.teamId !== undefined) updates.team_id = input.teamId;

  if (Object.keys(updates).length === 0) {
    throw new ProfileAppError('invalid_input', '변경할 프로필 정보가 없습니다.');
  }

  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', userId)
    .select(PROFILE_SELECT)
    .maybeSingle();

  if (error) throw toProfileError(error, 'update');
  if (!data) {
    throw new ProfileAppError('not_found', '사용자 프로필을 찾을 수 없습니다.');
  }

  return toUserProfile(data);
}
