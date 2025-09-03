// app/login/callback/page.tsx
'use client';

import { signInKakao } from '@/app/api/oauth';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef } from 'react';

const KakaoLoginCallbackPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get('code');
  const redirectUri = process.env.NEXT_PUBLIC_KAKAO_LOGIN_REDIRECT_URI!;

  const hasMutated = useRef(false);

  const loginMutation = useMutation({
    mutationFn: async () => {
      if (!code) throw new Error('카카오 인증 코드가 없습니다.');
      return await signInKakao({ token: code, redirectUri });
    },
    onSuccess: (data) => {
      console.log(data);
      router.replace('/'); // 로그인 성공
    },
    onError: (err) => {
      const axiosError = err as AxiosError;
      if (axiosError.response?.status === 404) {
        alert('등록되지 않은 사용자입니다. 회원가입을 먼저 해주세요.');
        router.replace('/signup'); // 회원가입 페이지 이동
      } else {
        console.error('로그인 실패:', err);
        router.replace('/login');
      }
    },
  });

  // if (code && !hasMutated.current) {
  //   hasMutated.current = true;
  //   loginMutation.mutate();
  // }
  useEffect(() => {
    if (code && !hasMutated.current) {
      hasMutated.current = true;
      loginMutation.mutate();
    }
  }, [code, loginMutation]);

  return <div className='grid place-items-center mt-20'>카카오 로그인 처리 중...</div>;
};

export default KakaoLoginCallbackPage;
