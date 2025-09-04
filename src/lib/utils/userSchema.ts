import { z } from 'zod';

export const userFormSchema = z
  .object({
    nickname: z
      .string()
      .min(1, '닉네임을 입력해주세요.')
      .max(10, '열 자 이하로 작성해주세요.')
      .refine((val) => !/\s/.test(val), '공백 없이 입력해주세요.'),
    email: z.string().optional(),
    password: z
      .string()
      .min(8, '8자 이상 입력해주세요.')
      .refine((val) => !/\s/.test(val), '공백 없이 입력해주세요.'),
    confirmPassword: z.string().min(1, '비밀번호 확인은 필수 입력입니다.'),
  })
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (password !== confirmPassword) {
      ctx.addIssue({
        path: ['confirmPassword'],
        code: 'custom',
        message: '비밀번호가 일치하지 않습니다.',
      });
    }
  });
export type UserFormValues = z.infer<typeof userFormSchema>;
