// 현재 프로필 조회 결과와 프로필 수정 행동을 모바일 화면으로 조립

import { useNavigate } from 'react-router';
import { useViewerStore } from '@/entities/viewer';
import { UpdateProfileForm } from '@/features/update-profile';
import { MobileLayout } from '@/widgets/mobile-layout';
import { useProfileEditData } from '../model/useProfileEditData';

export function ProfileEditPage() {
  const navigate = useNavigate();
  const user = useViewerStore((state) => state.user);
  const { data, errorMessage } = useProfileEditData(user?.id);

  function renderProfileEditContent() {
    if (errorMessage) {
      return (
        <p className="pt-8 text-sm font-semibold text-[var(--color-app-brand)]" role="alert">
          {errorMessage}
        </p>
      );
    }

    if (!data || !user) {
      return (
        <p className="pt-8 text-sm text-[var(--color-app-muted)]" role="status">
          프로필 정보를 불러오는 중
        </p>
      );
    }

    return (
      <UpdateProfileForm
        initialValues={{
          displayName: data.profile.displayName,
          phoneNumber: data.profile.phoneNumber ?? '',
          teamId: data.profile.teamId ?? '',
        }}
        onSuccess={() => navigate('/profile', { replace: true })}
        teams={data.teams}
        userId={user.id}
      />
    );
  }

  return (
    <MobileLayout showBackButton title="내 정보 수정">
      {renderProfileEditContent()}
    </MobileLayout>
  );
}
