// 로그인 폼의 입력값과 사용자용 검증 메시지를 정의

import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, '이메일을 입력해 주세요.')
    .pipe(z.email('올바른 이메일을 입력해 주세요.')),
  password: z.string().min(1, '비밀번호를 입력해 주세요.').min(6, '비밀번호는 6글자 이상입니다.'),
});

// 로그인 스키마에서 추론한 제출 값 타입
export type LoginFormValues = z.infer<typeof loginSchema>;
