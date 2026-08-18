// 공개 또는 본인 소유 게임 규칙 프리셋의 조회·생성·수정·삭제를 제공

import { supabase } from '../../supabase/client';
import type { Json, Tables, TablesInsert, TablesUpdate } from '../../supabase/database.types';
import { RulePresetAppError, toRulePresetError } from './rule-presets.error';

export type RulePreset = ReturnType<typeof toRulePreset>;

export type CreateRulePresetInput = {
  name: string;
  description?: string | null;
  rules: Record<string, Json | undefined>;
  isPublic?: boolean;
};

export type UpdateRulePresetInput = {
  name?: string;
  description?: string | null;
  rules?: Record<string, Json | undefined>;
  isPublic?: boolean;
};

const RULE_PRESET_SELECT =
  'id,name,description,rules,owner_id,is_public,created_at,updated_at' as const;

type RulePresetRow = Pick<
  Tables<'game_rule_presets'>,
  'id' | 'name' | 'description' | 'rules' | 'owner_id' | 'is_public' | 'created_at' | 'updated_at'
>;

// 프리셋 행의 소유자·공개 여부를 앱 표기로 변환
function toRulePreset(row: RulePresetRow) {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    rules: row.rules,
    ownerId: row.owner_id,
    isPublic: row.is_public,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// RLS가 허용한 공개 또는 본인 소유 프리셋 조회
export async function listRulePresets(): Promise<RulePreset[]> {
  const { data, error } = await supabase
    .from('game_rule_presets')
    .select(RULE_PRESET_SELECT)
    .order('name');

  if (error) throw toRulePresetError(error, 'load');
  return data.map(toRulePreset);
}

// 로그인 사용자를 소유자로 하는 프리셋 생성
export async function createRulePreset(
  userId: string,
  input: CreateRulePresetInput,
): Promise<RulePreset> {
  const value: TablesInsert<'game_rule_presets'> = {
    name: input.name.trim(),
    description: input.description,
    rules: input.rules,
    owner_id: userId,
    is_public: input.isPublic ?? false,
  };

  const { data, error } = await supabase
    .from('game_rule_presets')
    .insert(value)
    .select(RULE_PRESET_SELECT)
    .single();

  if (error) throw toRulePresetError(error, 'save');
  return toRulePreset(data);
}

// 소유자가 전달한 필드만 프리셋에 반영
export async function updateRulePreset(
  presetId: string,
  input: UpdateRulePresetInput,
): Promise<RulePreset> {
  const updates: TablesUpdate<'game_rule_presets'> = {};

  if (input.name !== undefined) updates.name = input.name.trim();
  if (input.description !== undefined) updates.description = input.description;
  if (input.rules !== undefined) updates.rules = input.rules;
  if (input.isPublic !== undefined) updates.is_public = input.isPublic;

  if (Object.keys(updates).length === 0) {
    throw new RulePresetAppError('invalid_input', '변경할 게임 규칙 정보가 없습니다.');
  }

  const { data, error } = await supabase
    .from('game_rule_presets')
    .update(updates)
    .eq('id', presetId)
    .select(RULE_PRESET_SELECT)
    .maybeSingle();

  if (error) throw toRulePresetError(error, 'save');
  if (!data) {
    throw new RulePresetAppError('not_found', '게임 규칙 프리셋을 찾을 수 없습니다.');
  }

  return toRulePreset(data);
}

// 소유자의 프리셋 삭제
export async function deleteRulePreset(presetId: string): Promise<void> {
  const { error } = await supabase.from('game_rule_presets').delete().eq('id', presetId);

  if (error) throw toRulePresetError(error, 'delete');
}
