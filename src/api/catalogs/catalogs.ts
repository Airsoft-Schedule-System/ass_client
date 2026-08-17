// 게임 생성과 프로필에서 사용하는 팀·필드 기준 데이터 조회를 제공

import { toCatalogError } from '@/api/catalogs/catalogs.error';
import { supabase } from '@/lib/supabase/client';
import type { Tables } from '@/lib/supabase/database.types';

export type TeamOption = Pick<Tables<'teams'>, 'id' | 'name'>;

export type FieldOption = ReturnType<typeof toFieldOption>;

// 필드 좌표 컬럼을 화면에서 사용하는 이름으로 변환
function toFieldOption(field: Pick<Tables<'fields'>, 'id' | 'name' | 'address' | 'lat' | 'lng'>) {
  return {
    id: field.id,
    name: field.name,
    address: field.address,
    latitude: field.lat,
    longitude: field.lng,
  };
}

// 가입된 팀을 이름순 선택 항목으로 조회
export async function listTeams(): Promise<TeamOption[]> {
  const { data, error } = await supabase.from('teams').select('id,name').order('name');

  if (error) throw toCatalogError(error);
  return data;
}

// 등록된 게임 필드를 이름순 선택 항목으로 조회
export async function listFields(): Promise<FieldOption[]> {
  const { data, error } = await supabase
    .from('fields')
    .select('id,name,address,lat,lng')
    .order('name');

  if (error) throw toCatalogError(error);

  return data.map(toFieldOption);
}
