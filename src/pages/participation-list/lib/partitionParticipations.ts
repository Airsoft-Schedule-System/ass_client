// 참가 내역을 게임 종료 시각 기준으로 진행 중과 지난 게임으로 분류

import type { UserParticipation } from '@/shared/api';

export type ParticipationGroups = {
  ongoing: UserParticipation[]; // 아직 종료 시각이 지나지 않은 참가 내역
  past: UserParticipation[]; // 종료 시각이 지난 참가 내역
};

function getSessionEndTime(participation: UserParticipation) {
  return new Date(participation.session.endsAt ?? participation.session.startsAt).getTime();
}

export function partitionParticipations(
  participations: UserParticipation[],
  now: Date = new Date(),
): ParticipationGroups {
  const currentTime = now.getTime();
  const ongoing: UserParticipation[] = [];
  const past: UserParticipation[] = [];

  participations.forEach((participation) => {
    if (getSessionEndTime(participation) > currentTime) {
      ongoing.push(participation);
      return;
    }

    past.push(participation);
  });

  ongoing.sort((left, right) => getSessionEndTime(left) - getSessionEndTime(right));
  past.sort((left, right) => getSessionEndTime(right) - getSessionEndTime(left));

  return { ongoing, past };
}
