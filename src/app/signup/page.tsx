'use client';

import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import FormInput from '@/components/common/FormInput';
import { validations } from '@/lib/utils/validations';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { signup } from '../api/user';
import { AxiosError } from 'axios';
import { useEffect } from 'react';
import { errorToast, successToast } from '@/lib/utils/toastUtils';

type FormValues = {
  email: string;
  password: string;
  nickname: string;
  confirmPassword: string;
  agree: boolean;
};

// 로그인 후 페이지 진입에 대해 ...
const SignUp = () => {
  const router = useRouter();

  const goToLogin = () => {
    router.push('/login');
  };

  const {
    register,
    handleSubmit,
    watch,
    setError,
    trigger,
    formState: { isSubmitted, isSubmitting, isValid, errors },
  } = useForm<FormValues>({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
      nickname: '',
      confirmPassword: '',
      agree: false,
    },
  });

  // 제출 버튼 활성화/비활성화 제어, defaultValues으로 초기 값 false 설정
  // isFilled: 제출 버튼 활성화 제어용
  const allFields = watch();
  const isFilled = Object.values(allFields).every(Boolean);

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

  // 회원가입 요청 mutation
  const mutation = useMutation({
    mutationFn: signup,
    mutationKey: ['signup'],
    onSuccess: (data) => {
      console.log('회원가입 정보', data);

      goToLogin();
      successToast.run('회원가입이 완료되었습니다');
    },
    onError: (err: unknown) => {
      const error = err as AxiosError<{ message: string }>;

      // 리팩토링 때 훅으로 만들 예정
      const { status, data } = error.response ?? {};

      const emailError = data?.message.includes('이메일');

      let handled = false;

      if (status === 400 || status === 409) {
        if (emailError) {
          setError('email', {
            type: 'server',
            message: error.response?.data.message,
          });

          handled = true;
        }

        if (!handled) errorToast.run(data?.message);
      } else {
        errorToast.run(data?.message);
      }
    },
    retry: 0,
  });

  // 폼 제출
  const onSubmit = (data: FormValues) => {
    mutation.mutate({
      email: data.email,
      nickname: data.nickname,
      password: data.password,
    });
  };

  // 카카오 회원가입
  const handleKakaoSingUP = () => {
    const REST_API_KEY = process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY!;
    const REDIRECT_URI = encodeURIComponent(process.env.NEXT_PUBLIC_KAKAO_SIGNUP_REDIRECT_URI!);

    // 카카오 회원가입 페이지로 이동
    const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code&state=signup`;

    window.location.href = kakaoAuthUrl;
  };

  return (
    <div className=' m-auto grid place-items-center px-[24px] max-w-[674px]'>
      <Image
        src='/images/logo_large.svg'
        width={150}
        height={200}
        alt='Trivera'
        className='object-contain w-auto h-auto mb-[60px] cursor-pointer'
        onClick={() => {
          router.push('/');
        }}
      />
      <form onSubmit={handleSubmit(onSubmit)} className='w-full grid gap-1' noValidate>
        <FormInput
          type='text'
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
          {...register('confirmPassword', validations.confirmPassword(password))}
        />

        <div className='mb-2 flex items-center gap-1'>
          <input type='checkbox' id='agree' {...register('agree', { required: true })} />
          <label htmlFor='agree' className='text-[14px]'>
            이용약관에 동의합니다.
          </label>
        </div>

        <Button
          type='submit'
          size='lg'
          className='w-full mt-2'
          disabled={isSubmitted ? !isValid : !isFilled}
        >
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
        className='w-full bg-[#FEE500] text-[#3C1E1E] border-none hover:bg-[#FEE500]/60'
        onClick={handleKakaoSingUP}
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
