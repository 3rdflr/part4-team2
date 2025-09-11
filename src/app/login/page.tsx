'use client';

import { useRouter } from 'next/navigation';

import { useForm } from 'react-hook-form';

import { useMutation } from '@tanstack/react-query';
import { useUserStore } from '@/store/userStore';
import { AxiosError } from 'axios';
import { login } from '../api/auth';
import { getUserInfo } from '../api/user';
import { errorToast, successToast } from '@/lib/utils/toastUtils';
import { useAuthRedirect } from '@/hooks/useAuthRedirect';
import { AuthForm, EmailInput, PasswordInput } from '@/components/pages/auth/AuthFormValidations';
import { redirectToKakaoAuth } from '@/components/pages/auth/kakao';
import LogoImage from '@/components/pages/auth/LogoImage';
import KakaoButton from '@/components/pages/auth/KakaoButton';
import Divider from '@/components/pages/auth/Divider';
import AuthHelperText from '@/components/pages/auth/AuthHelperText';

type FormValues = {
  email: string;
  password: string;
};

const Login = () => {
  const router = useRouter();
  const setUser = useUserStore((state) => state.setUser);

  const methods = useForm<FormValues>({
    mode: 'onTouched',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // 로그인 요청 mutation
  const mutation = useMutation({
    mutationFn: login,
    mutationKey: ['login'],
    onSuccess: async () => {
      const user = await getUserInfo();
      setUser(user);

      setTimeout(() => {
        const redirectUrl = sessionStorage.getItem('redirectUrl');
        if (redirectUrl) {
          sessionStorage.removeItem('redirectUrl');
          router.replace(redirectUrl);
        }

        successToast.run(`${user.nickname}님 환영합니다!`);
      }, 0);
    },
    onError: (err: unknown) => {
      const error = err as AxiosError<{ message: string }>;
      const { status, data } = error.response ?? {};

      if (status === 400 || status === 409) {
        const fieldMap: Record<string, string> = {
          email: '이메일',
          password: '비밀번호',
        };

        let handled = false;

        for (const [field, keyword] of Object.entries(fieldMap)) {
          if (data?.message.includes(keyword)) {
            methods.setError(field as keyof FormValues, {
              type: 'server',
              message: data.message,
            });

            handled = true;

            break;
          }
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
      password: data.password,
    });
  };

  // 로그인 상태일 때 진입 막음
  useAuthRedirect();

  return (
    <div className=' m-auto grid place-items-center px-[24px] max-w-[674px] mt-15'>
      {/* 로고 이미지, 메인 바로가기 */}
      <LogoImage />

      {/* 로그인 폼 */}
      <AuthForm methods={methods} onSubmit={onSubmit} type='login'>
        <EmailInput />
        <PasswordInput />
      </AuthForm>

      {/* 구분선 */}
      <Divider text='or' />

      {/* 카카오 회원가입 버튼 */}
      <KakaoButton type='login' onClick={() => redirectToKakaoAuth('login')} />

      {/* 회원가입 페이지로 다이랙트 */}
      <AuthHelperText directUrl='signup' />
    </div>
  );
};

export default Login;
