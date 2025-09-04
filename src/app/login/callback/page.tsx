'use client';

import { AxiosError } from 'axios';
import { useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signInKakao } from '@/app/api/oauth';
import { getUserInfo } from '@/app/api/user';
import { useUserStore } from '@/store/userStore';
import { useMutation } from '@tanstack/react-query';
import { errorToast, successToast } from '@/lib/utils/toastUtils';
import Spinner from '@/components/common/Spinner';

const KakaoLoginCallbackPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get('code');
  const redirectUri = process.env.NEXT_PUBLIC_KAKAO_LOGIN_REDIRECT_URI!;

  const setUser = useUserStore((state) => state.setUser);

  const hasMutated = useRef(false);

  const loginMutation = useMutation({
    mutationFn: async () => {
      if (!code) throw new Error('카카오 인증 코드가 없습니다.');
      return await signInKakao({ token: code, redirectUri });
    },
    onSuccess: async () => {
      const user = await getUserInfo();
      setUser(user);

      router.replace('/');
      successToast.run(`${user.nickname}님 환영합니다!`);
    },
    onError: (err) => {
      const error = err as AxiosError<{ message: string }>;
      const status = error.response?.status;
      const errorMessage = error.response?.data?.message ?? '';

      if (status === 404) {
        errorToast.run('등록되지 않은 사용자입니다. 회원가입을 먼저 해주세요.');
        router.replace('/signup');
      } else {
        errorToast.run(errorMessage);
        router.replace('/login');
      }
    },
  });

  useEffect(() => {
    if (code && !hasMutated.current) {
      hasMutated.current = true;
      loginMutation.mutate();
    }
  }, [code, loginMutation]);

  return (
    <>
      <div className='h-[48px]'></div>
      {Spinner()}
    </>
  );
};

export default KakaoLoginCallbackPage;
