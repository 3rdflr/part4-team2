'use client';

import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { signup } from '../api/user';
import { AxiosError } from 'axios';
import { errorToast, successToast } from '@/lib/utils/toastUtils';
import { useAuthRedirect } from '@/hooks/useAuthRedirect';
import {
  AuthForm,
  EmailInput,
  NicknameInput,
  PasswordInput,
  ConfirmPasswordInput,
  AgreeCheckbox,
} from '@/components/pages/auth/authInputValidations';

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

  const methods = useForm<FormValues>({
    mode: 'onTouched',
    defaultValues: {
      email: '',
      password: '',
      nickname: '',
      confirmPassword: '',
      agree: false,
    },
  });

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
          methods.setError('email', {
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

  // 로그인 상태일 때 진입 막음
  useAuthRedirect();

  return (
    <div className='m-auto grid place-items-center px-[24px] max-w-[674px] mt-15'>
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

      <AuthForm methods={methods} onSubmit={onSubmit} submitLabel='회원가입'>
        <EmailInput />
        <NicknameInput />
        <PasswordInput />
        <ConfirmPasswordInput />
        <AgreeCheckbox />
      </AuthForm>

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
