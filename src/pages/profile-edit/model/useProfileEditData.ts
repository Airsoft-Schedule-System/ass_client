// 현재 프로필과 팀 선택지를 조회해 프로필 수정 페이지 데이터로 제공

import { useEffect, useState } from 'react';
import { getMyProfile, listTeams, toProfileError } from '@/shared/api';
import type { TeamOption, UserProfile } from '@/shared/api';

type ProfileEditData = {
  profile: UserProfile; // 수정 폼의 초기값으로 사용할 현재 프로필
  teams: TeamOption[]; // 소속 팀 선택지
};

export function useProfileEditData(userId: string | undefined) {
  const [data, setData] = useState<ProfileEditData | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;

    let cancelled = false;
    const currentUserId = userId;

    async function loadProfileEditData() {
      try {
        const [profile, teams] = await Promise.all([getMyProfile(currentUserId), listTeams()]);

        if (!cancelled) setData({ profile, teams });
      } catch (error) {
        if (!cancelled) setErrorMessage(toProfileError(error, 'load').message);
      }
    }

    void loadProfileEditData();

    return () => {
      cancelled = true;
    };
  }, [userId]);

  return { data, errorMessage };
}
