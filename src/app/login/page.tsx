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

  // 로그인 성공 시 다이랙트 설정
  // const params = new URLSearchParams(window.location.search);
  // const redirectUrl = params.get('redirect');
  // const source = params.get('source');

  // const handleLoginSuccess = () => {
  //   console.log(source);
  //   alert(source);

  //   if (source === 'signup') {
  //     // 회원가입 페이지를 통해 왔다면 무조건 메인 페이지로 이동
  //     router.push('/');
  //   } else if (redirectUrl) {
  //     // 리다이렉트 URL이 있다면 해당 페이지로 이동
  //     router.push(redirectUrl);
  //   } else {
  //     // 리다이렉트 URL이 없다면 기본 페이지(메인)로 이동
  //     router.push('/');
  //   }
  // };

  // 로그인 요청 mutation
  const mutation = useMutation({
    mutationFn: login,
    mutationKey: ['login'],
    onSuccess: async () => {
      const user = await getUserInfo();
      setUser(user);

      router.push('/');

      // handleLoginSuccess();

      successToast.run(`${user.nickname}님 환영합니다!`);
    },
    onError: (err: unknown) => {
      const error = err as AxiosError<{ message: string }>;

      // alert => 모달로 변경 예정, 리팩토링 때 훅으로 만들 예정
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

      {/*  */}
      <div className='flex my-[30px] w-full items-center'>
        <hr className='w-full flex-grow' />
        <span className='mx-4 text-[16px] text-[var(--grayscale-700)] text-center whitespace-nowrap cursor-default'>
          or
        </span>
        <hr className='w-full flex-grow' />
      </div>

      {/* 카카오 회원가입 버튼 */}
      <KakaoButton type='login' onClick={() => redirectToKakaoAuth('login')} />

      <p className='text-[var(--grayscale-400)] mt-[30px] cursor-default'>
        회원이 아니신가요?
        <span
          onClick={() => {
            router.push('/signup');
          }}
          className='underline cursor-pointer ml-1'
        >
          회원가입하기
        </span>
      </p>
    </div>
  );
};

export default Login;
