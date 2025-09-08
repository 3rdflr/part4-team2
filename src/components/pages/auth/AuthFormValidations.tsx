'use client';

import { useEffect } from 'react';
import {
  FieldValues,
  FormProvider,
  SubmitHandler,
  useFormContext,
  UseFormReturn,
} from 'react-hook-form';
import { Button } from '@/components/ui/button';
import FormInput from '@/components/common/FormInput';

/**
 * 회원가입 / 로그인 input
 */

type FormValues = {
  email: string;
  password: string;
  nickname: string;
  confirmPassword: string;
  agree: boolean;
};

type AuthFormProps<T extends FieldValues> = {
  methods: UseFormReturn<T>;
  onSubmit: SubmitHandler<T>;
  type: 'login' | 'signup';
  children: React.ReactNode;
} & Omit<React.FormHTMLAttributes<HTMLFormElement>, 'onSubmit'>;

// Input Components
export const EmailInput = () => {
  const {
    register,
    formState: { errors, isSubmitted },
  } = useFormContext<FormValues>();

  return (
    <FormInput
      type='text'
      id='email'
      label='이메일'
      placeholder='이메일을 입력해 주세요'
      aria-invalid={isSubmitted ? (errors.email ? 'true' : 'false') : undefined}
      error={errors.email?.message}
      {...register('email', {
        required: '이메일은 필수 입력입니다.',
        validate: (value: string) => {
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            return '이메일 형식으로 작성해 주세요.';
          }
          if (!/^\S+$/.test(value)) {
            return '공백 없이 입력해주세요.';
          }
          return true;
        },
      })}
    />
  );
};

export const NicknameInput = () => {
  const {
    register,
    formState: { errors, isSubmitted },
  } = useFormContext<FormValues>();

  return (
    <FormInput
      type='text'
      id='nickName'
      label='닉네임'
      placeholder='닉네임을 입력해 주세요'
      aria-invalid={isSubmitted ? (errors.nickname ? 'true' : 'false') : undefined}
      error={errors.nickname?.message}
      {...register('nickname', {
        required: '닉네임을 입력해주세요.',
        maxLength: {
          value: 10,
          message: '열 자 이하로 작성해주세요.',
        },
        pattern: { value: /^[a-zA-Z0-9가-힣]+$/, message: '공백이나 특수문자 없이 입력해주세요.' },
      })}
    />
  );
};

export const PasswordInput = () => {
  const {
    register,
    formState: { errors, isSubmitted },
  } = useFormContext<FormValues>();

  return (
    <FormInput
      type='password'
      id='password'
      label='비밀번호'
      placeholder='8자 이상 입력해 주세요'
      aria-invalid={isSubmitted ? (errors.password ? 'true' : 'false') : undefined}
      error={errors.password?.message}
      {...register('password', {
        required: '비밀번호 필수 입력입니다.',
        minLength: {
          value: 8,
          message: '8자 이상 입력해주세요.',
        },
        pattern: { value: /^\S+$/, message: '공백 없이 입력해주세요.' },
      })}
    />
  );
};

export const ConfirmPasswordInput = () => {
  const {
    register,
    watch,
    trigger,
    formState: { errors, isSubmitted },
  } = useFormContext<FormValues>();

  // password 필드 값 구독
  // 비밀번호 변경 시 confirmPassword 실시간 검증
  const password = watch('password');

  // 비밀번호가 바뀌면 confirmPassword 유효성 재검사
  // 첫 제출 전에는 메시지 표시 안 함
  useEffect(() => {
    if (isSubmitted) {
      trigger('confirmPassword');
    }
  }, [password, trigger, isSubmitted]);

  return (
    <FormInput
      type='password'
      id='confirmPassword'
      label='비밀번호 확인'
      placeholder='비밀번호를 한 번 더 입력해 주세요'
      aria-invalid={isSubmitted ? (errors.confirmPassword ? 'true' : 'false') : undefined}
      error={errors.confirmPassword?.message}
      {...register('confirmPassword', {
        required: '비밀번호 확인은 필수 입력입니다.',
        validate: (value: string) => value === password || '비밀번호가 일치하지 않습니다.',
      })}
    />
  );
};

export const AgreeCheckbox = () => {
  const { register } = useFormContext<FormValues>();

  return (
    <div className='mb-2 flex items-center gap-1'>
      <input type='checkbox' id='agree' {...register('agree', { required: true })} />
      <label htmlFor='agree' className='text-[14px]'>
        이용약관에 동의합니다.
      </label>
    </div>
  );
};

export const AuthForm = <T extends FieldValues>({
  methods,
  onSubmit,
  children,
  type,
}: AuthFormProps<T>) => {
  // 제출 버튼 활성화/비활성화 제어, defaultValues으로 초기 값 false 설정
  // isFilled: 제출 버튼 활성화 제어용
  const allFields = methods.watch();
  const isFilled = Object.values(allFields).every(Boolean);

  const submitLabel = type === 'signup' ? '회원가입' : '로그인';

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className='w-full grid gap-1' noValidate>
        {children}
        <Button
          type='submit'
          size='lg'
          className='w-full mt-2'
          disabled={!isFilled || !methods.formState.isValid}
        >
          {methods.formState.isSubmitting ? `${submitLabel} 중...` : `${submitLabel}하기`}
        </Button>
      </form>
    </FormProvider>
  );
};
