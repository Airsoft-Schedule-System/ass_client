// 로그인 사용자의 기본 프로필을 조회하고 수정하는 화면

import { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { listTeams } from '@/api/catalogs/catalogs';
import type { TeamOption } from '@/api/catalogs/catalogs';
import { getMyProfile, updateMyProfile } from '@/api/profiles/profiles';
import { toProfileError } from '@/api/profiles/profiles.error';
import { MobileLayout } from '@/app/layouts/MobileLayout';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Select } from '@/components/common/Select';
import { CheckIcon } from '@/components/icons/CheckIcon';
import { PhoneIcon } from '@/components/icons/PhoneIcon';
import { TeamIcon } from '@/components/icons/TeamIcon';
import { UserIcon } from '@/components/icons/UserIcon';
import { profileSchema } from '@/features/profile/schemas/profile.schema';
import type { ProfileFormValues } from '@/features/profile/schemas/profile.schema';
import { useAuthStore } from '@/features/auth/stores/auth.store';

export function ProfileSetupPage() {
  const [loadErrorMessage, setLoadErrorMessage] = useState<string | null>(null);
  const [teams, setTeams] = useState<TeamOption[] | null>(null);
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const {
    clearErrors,
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    reset,
    setError,
  } = useForm<ProfileFormValues>({
    defaultValues: {
      displayName: '',
      phoneNumber: '',
      teamId: '',
    },
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    if (!user) return;

    let cancelled = false;
    const userId = user.id;

    // 프로필과 팀 목록을 함께 불러와 폼의 초기값을 구성
    async function loadProfileForm() {
      try {
        const [profile, teamOptions] = await Promise.all([getMyProfile(userId), listTeams()]);

        if (cancelled) return;

        setTeams(teamOptions);
        reset({
          displayName: profile.displayName,
          phoneNumber: profile.phoneNumber ?? '',
          teamId: profile.teamId ?? '',
        });
      } catch (error) {
        if (cancelled) return;

        setLoadErrorMessage(toProfileError(error, 'load').message);
      }
    }

    void loadProfileForm();

    return () => {
      cancelled = true;
    };
  }, [reset, user]);

  // 검증된 폼 값을 현재 사용자의 수정 가능한 프로필 컬럼에 저장
  async function handleProfileSave({ displayName, phoneNumber, teamId }: ProfileFormValues) {
    if (!user) return;

    clearErrors('root.server');

    try {
      await updateMyProfile(user.id, {
        displayName,
        phoneNumber: phoneNumber || null,
        teamId: teamId || null,
      });
      navigate('/', { replace: true });
    } catch (error) {
      setError('root.server', {
        message: toProfileError(error, 'update').message,
        type: 'server',
      });
    }
  }

  return (
    <MobileLayout showBackButton title="프로필 수정">
      {teams === null && !loadErrorMessage ? (
        <p className="pt-8 text-sm text-[var(--color-app-muted)]" role="status">
          프로필 정보를 불러오는 중
        </p>
      ) : null}

      {loadErrorMessage ? (
        <p className="pt-8 text-sm font-semibold text-[var(--color-app-brand)]" role="alert">
          {loadErrorMessage}
        </p>
      ) : null}

      {teams ? (
        <form
          className="flex min-h-0 flex-1 flex-col pt-2"
          noValidate
          onSubmit={handleSubmit(handleProfileSave)}
        >
          <div className="min-h-0 flex-1 overflow-y-auto pb-4">
            <div className="flex flex-col gap-2">
              <Input
                {...register('displayName')}
                autoComplete="nickname"
                errorMessage={errors.displayName?.message}
                label="닉네임"
                leadingIcon={<UserIcon />}
                maxLength={30}
                placeholder="사용할 닉네임 입력"
                required
              />

              <Select
                {...register('teamId')}
                errorMessage={errors.teamId?.message}
                label="소속 팀"
                leadingIcon={<TeamIcon />}
              >
                <option value="">소속 팀 없음</option>
                {teams.map((team) => (
                  <option key={team.id} value={team.id}>
                    {team.name}
                  </option>
                ))}
              </Select>

              <Input
                {...register('phoneNumber')}
                autoComplete="tel"
                errorMessage={errors.phoneNumber?.message}
                inputMode="tel"
                label="연락처"
                leadingIcon={<PhoneIcon />}
                maxLength={20}
                placeholder="010-1234-5678"
                type="tel"
              />
            </div>
          </div>

          {errors.root?.server?.message ? (
            <p className="pb-3 text-sm font-semibold text-[var(--color-app-brand)]" role="alert">
              {errors.root.server.message}
            </p>
          ) : null}

          <Button
            className="shrink-0"
            disabled={isSubmitting}
            trailingIcon={<CheckIcon className="size-5" />}
            type="submit"
          >
            {isSubmitting ? '저장 중' : '변경사항 저장'}
          </Button>
        </form>
      ) : null}
    </MobileLayout>
  );
}
