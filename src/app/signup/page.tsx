'use client';

import { useForm } from 'react-hook-form';

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
} from '@/components/pages/auth/AuthFormValidations';
import { redirectToKakaoAuth } from '@/components/pages/auth/kakao';
import LogoImage from '@/components/pages/auth/LogoImage';
import KakaoButton from '@/components/pages/auth/KakaoButton';
import Divider from '@/components/pages/auth/Divider';
import AuthHelperText from '@/components/pages/auth/AuthHelperText';

type FormValues = {
  email: string;
  password: string;
  nickname: string;
  confirmPassword: string;
  agree: boolean;
};

const SignUp = () => {
  const router = useRouter();

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
    onSuccess: () => {
      router.push('/login');
      successToast.run('회원가입이 완료되었습니다');
    },
    onError: (err: unknown) => {
      const error = err as AxiosError<{ message: string }>;
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

  // 로그인 상태일 때 진입 막음
  useAuthRedirect();

  return (
    <div className='m-auto grid place-items-center px-[24px] max-w-[674px] mt-15'>
      {/* 로고 이미지, 메인 바로가기 */}
      <LogoImage />

      {/* 회원가입 폼 */}
      <AuthForm methods={methods} onSubmit={onSubmit} type='signup'>
        <EmailInput />
        <NicknameInput />
        <PasswordInput />
        <ConfirmPasswordInput />
        <AgreeCheckbox />
      </AuthForm>

      {/* 구분선 */}
      <Divider text='SNS 계정으로 회원가입하기' />

      {/* 카카오 회원가입 버튼 */}
      <KakaoButton type='signup' onClick={() => redirectToKakaoAuth('signup')} />

      {/* 로그인 페이지로 다이랙트 */}
      <AuthHelperText directUrl='login' />
    </div>
  );
};

export default SignUp;
