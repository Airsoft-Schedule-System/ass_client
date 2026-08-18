// 회원가입 폼의 입력값과 사용자용 검증 메시지를 정의

import { z } from 'zod';

export const signUpSchema = z
  .object({
    displayName: z
      .string()
      .trim()
      .min(1, '닉네임을 입력해 주세요.')
      .max(30, '닉네임은 30글자 이하로 입력해 주세요.'),
    email: z
      .string()
      .trim()
      .min(1, '이메일을 입력해 주세요.')
      .pipe(z.email('올바른 이메일을 입력해 주세요.')),
    password: z
      .string()
      .min(1, '비밀번호를 입력해 주세요.')
      .min(6, '비밀번호는 6글자 이상이어야 합니다.'),
    passwordConfirm: z.string().min(1, '비밀번호를 다시 입력해 주세요.'),
  })
  .refine(({ password, passwordConfirm }) => password === passwordConfirm, {
    message: '비밀번호가 일치하지 않습니다.',
    path: ['passwordConfirm'],
  });

// 회원가입 스키마에서 추론한 제출 값 타입
export type SignUpFormValues = z.infer<typeof signUpSchema>;
