'use client';

import { useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AxiosError } from 'axios';
import { signUpKakao } from '@/app/api/oauth';
import { useMutation } from '@tanstack/react-query';
import { errorToast, successToast } from '@/lib/utils/toastUtils';
import { redirectToKakaoAuth } from '@/components/pages/auth/kakao';
import getRandomNickname from '@/lib/utils/randomNicknameUtils';
import Spinner from '@/components/common/Spinner';

const KakaoSignupCallbackPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get('code');
  const redirectUri = process.env.NEXT_PUBLIC_KAKAO_SIGNUP_REDIRECT_URI!;

  const hasMutated = useRef(false);

  const signupMutation = useMutation({
    mutationFn: async () => {
      if (!code) throw new Error('카카오 인증 코드가 없습니다.');
      const nickname = getRandomNickname();

      return await signUpKakao({ token: code, redirectUri, nickname });
    },
    onSuccess: async () => {
      successToast.run('Trivera 카카오 회원가입이 완료되었습니다!');
      redirectToKakaoAuth('login');
      router.replace('/');
    },
    onError: (err) => {
      const error = err as AxiosError<{ message: string }>;
      const status = error.response?.status;
      const errorMessage = error.response?.data?.message ?? '';

      errorToast.run(errorMessage);

      if ((status === 409 || status === 400) && errorMessage.includes('등록된')) {
        router.replace('/login');
        return;
      }

      router.replace('/signup');
    },
  });

  useEffect(() => {
    if (code && !hasMutated.current) {
      hasMutated.current = true;
      signupMutation.mutate();
    }
  }, [code, signupMutation]);

  return (
    <>
      <div className='h-[48px]'></div>
      {Spinner()}
    </>
  );
};

export default KakaoSignupCallbackPage;
