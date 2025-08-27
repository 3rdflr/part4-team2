'use client';

import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import FormInput from '@/components/common/FormInput';
import { validations, confirmPassword } from '@/lib/utils/validations';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { signup } from '../api/user';
import { AxiosError } from 'axios';

type FormValues = {
  email: string;
  password: string;
  nickname: string;
  confirmPassword: string;
  agree: boolean;
};

const SignUp = () => {
  const router = useRouter();

  const goToLogin = () => {
    router.push('/login');
  };

  const {
    register,
    handleSubmit,
    getValues,
    watch,
    setError,
    formState: { isSubmitted, isSubmitting, errors },
  } = useForm<FormValues>({
    mode: 'onChange',
  });

  const agree = watch('agree');

  // tanstack
  const mutation = useMutation({
    mutationFn: signup,
    mutationKey: ['signup'],
    onSuccess: (data) => {
      console.log('회원가입 성공', data);
    },
    onError: (err: unknown) => {
      const error = err as AxiosError<{ message: string }>;

      if (error.response?.data.message.includes('이메일')) {
        setError('email', {
          type: 'server',
          message: error.response?.data.message,
        });
      }
    },
    retry: 0,
  });

  const onSubmit = (data: FormValues) => {
    mutation.mutate({
      email: data.email,
      nickname: data.nickname,
      password: data.password,
    });
  };

  return (
    <div className=' m-auto grid place-items-center px-[24px] max-w-[674px]'>
      <Image
        src='/images/logo_large.svg'
        width={150}
        height={200}
        alt='Trivera'
        className='object-contain w-auto h-auto mb-[60px]'
      />
      <form onSubmit={handleSubmit(onSubmit)} className='w-full grid gap-1'>
        <FormInput
          type='email'
          id='email'
          label='이메일'
          placeholder='이메일을 입력해 주세요'
          aria-invalid={isSubmitted ? (errors.email ? 'true' : 'false') : undefined}
          error={errors.email?.message}
          {...register('email', validations.email)}
        />
        <FormInput
          type='text'
          id='nickName'
          label='닉네임'
          placeholder='닉네임을 입력해 주세요'
          aria-invalid={isSubmitted ? (errors.nickname ? 'true' : 'false') : undefined}
          error={errors.nickname?.message}
          {...register('nickname', validations.nickname)}
        />
        <FormInput
          type='password'
          id='password'
          label='비밀번호'
          placeholder='8자 이상 입력해 주세요'
          aria-invalid={isSubmitted ? (errors.password ? 'true' : 'false') : undefined}
          error={errors.password?.message}
          {...register('password', validations.password)}
        />
        <FormInput
          type='password'
          id='confirmPassword'
          label='비밀번호 확인'
          placeholder='비밀번호를 한 번 더 입력해 주세요'
          aria-invalid={isSubmitted ? (errors.confirmPassword ? 'true' : 'false') : undefined}
          error={errors.confirmPassword?.message}
          {...register(
            'confirmPassword',
            confirmPassword(() => getValues('password')),
          )}
        />

        <div className='mb-2 flex items-center gap-1'>
          <input type='checkbox' id='agree' {...register('agree')} />
          <label htmlFor='agree' className='text-[14px]'>
            이용약관에 동의합니다.
          </label>
        </div>

        <Button type='submit' size='lg' className='w-full mt-2' disabled={!agree || isSubmitting}>
          {isSubmitting ? '회원가입하기 중...' : '회원가입하기'}
        </Button>
      </form>

      <div className='flex my-[30px] w-full items-center'>
        <hr className='w-full flex-grow' />
        <span className='mx-4 text-[16px] text-[var(--grayscale-700)] w-full text-center whitespace-nowrap cursor-default'>
          SNS 계정으로 회원가입하기
        </span>
        <hr className='w-full flex-grow' />
      </div>
      <Button
        type='submit'
        variant='secondary'
        size='lg'
        className='w-full bg-[#FEE500] text-[#3C1E1E] border-none'
      >
        <Image
          src='/images/icons/icon_kakao.svg'
          width={24}
          height={24}
          alt='카카오톡 아이콘'
          className='w-6 h-6 object-contain'
        />
        카카오 회원가입
      </Button>
      <p className='text-[var(--grayscale-400)] mt-[30px] cursor-default'>
        회원이신가요?
        <span onClick={goToLogin} className='underline cursor-pointer ml-1'>
          로그인하기
        </span>
      </p>
    </div>
  );
};

export default SignUp;
