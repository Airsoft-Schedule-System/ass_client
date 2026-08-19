// 프로필 입력을 검증하고 현재 사용자의 수정 요청 상태를 관리하는 폼

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toProfileError, updateMyProfile } from '@/shared/api';
import type { TeamOption } from '@/shared/api';
import { Button, CheckIcon, Input, PhoneIcon, Select, TeamIcon, UserIcon } from '@/shared/ui';
import { updateProfileSchema } from '../model/update-profile.schema';
import type { UpdateProfileFormValues } from '../model/update-profile.schema';

type UpdateProfileFormProps = {
  initialValues: UpdateProfileFormValues; // 조회된 현재 프로필로 구성한 폼 초기값
  onSuccess: () => void; // 저장 성공 후 페이지가 실행할 동작
  teams: TeamOption[]; // 사용자가 선택할 수 있는 팀 목록
  userId: string; // 수정할 현재 인증 사용자의 식별자
};

export function UpdateProfileForm({
  initialValues,
  onSuccess,
  teams,
  userId,
}: UpdateProfileFormProps) {
  const {
    clearErrors,
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    setError,
  } = useForm<UpdateProfileFormValues>({
    defaultValues: initialValues,
    resolver: zodResolver(updateProfileSchema),
  });

  async function handleProfileSave({ displayName, phoneNumber, teamId }: UpdateProfileFormValues) {
    clearErrors('root.server');

    try {
      await updateMyProfile(userId, {
        displayName,
        phoneNumber: phoneNumber || null,
        teamId: teamId || null,
      });
      onSuccess();
    } catch (error) {
      setError('root.server', {
        message: toProfileError(error, 'update').message,
        type: 'server',
      });
    }
  }

  return (
    <form
      className="flex min-h-0 flex-1 flex-col pt-2"
      noValidate
      onSubmit={handleSubmit(handleProfileSave)}
    >
      <div className="min-h-0 flex-1 pb-4">
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

      {errors.root?.server?.message && (
        <p className="pb-3 text-sm font-semibold text-[var(--color-app-brand)]" role="alert">
          {errors.root.server.message}
        </p>
      )}

      <Button
        className="shrink-0"
        disabled={isSubmitting}
        trailingIcon={<CheckIcon className="size-5" />}
        type="submit"
      >
        {isSubmitting ? '저장 중' : '변경사항 저장'}
      </Button>
    </form>
  );
}
