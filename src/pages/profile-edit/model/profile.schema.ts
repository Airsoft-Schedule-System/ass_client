// 프로필 설정 폼의 입력값과 사용자용 검증 메시지를 정의

import { z } from 'zod';

const optionalPhoneNumberSchema = z
  .string()
  .trim()
  .max(20, '연락처는 20글자 이하로 입력해 주세요.')
  .refine(
    (phoneNumber) => phoneNumber === '' || /^[0-9+()\-\s]+$/.test(phoneNumber),
    '연락처에는 숫자와 전화번호 기호만 입력해 주세요.',
  );

export const profileSchema = z.object({
  displayName: z
    .string()
    .trim()
    .min(1, '닉네임을 입력해 주세요.')
    .max(30, '닉네임은 30글자 이하로 입력해 주세요.'),
  teamId: z
    .string()
    .refine(
      (teamId) => teamId === '' || z.uuid().safeParse(teamId).success,
      '올바른 팀을 선택해 주세요.',
    ),
  phoneNumber: optionalPhoneNumberSchema,
});

// 프로필 설정 스키마에서 추론한 제출 값 타입
export type ProfileFormValues = z.infer<typeof profileSchema>;
