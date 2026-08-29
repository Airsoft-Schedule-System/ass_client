// 사용자가 자신의 참가 신청을 확인 후 취소할 수 있는 행동을 제공

import { useState } from 'react';
import { cancelParticipation, toParticipationError } from '@/shared/api';
import { Button } from '@/shared/ui';

type CancelParticipationButtonProps = {
  onSuccess: () => void; // 취소 성공 후 상세 데이터를 갱신하는 함수
  participationId: string; // 취소할 참가 신청 ID
};

export function CancelParticipationButton({
  onSuccess,
  participationId,
}: CancelParticipationButtonProps) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleCancel() {
    if (!window.confirm('참가 신청을 취소하시겠습니까?')) return;

    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      await cancelParticipation(participationId);
      onSuccess();
    } catch (error) {
      setErrorMessage(toParticipationError(error).message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex w-full flex-col gap-2">
      <Button disabled={isSubmitting} onClick={handleCancel} variant="secondary">
        {isSubmitting ? '취소하는 중' : '신청 취소'}
      </Button>
      {errorMessage ? (
        <p className="text-sm font-semibold text-[var(--color-app-danger)]" role="alert">
          {errorMessage}
        </p>
      ) : null}
    </div>
  );
}
