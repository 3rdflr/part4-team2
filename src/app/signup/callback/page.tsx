// app/signup/callback/page.tsx
'use client';

import { signUpKakao } from '@/app/api/oauth';
import { useMutation } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef } from 'react';

const KakaoSignupCallbackPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get('code');
  const redirectUri = process.env.NEXT_PUBLIC_KAKAO_SIGNUP_REDIRECT_URI!;

  const hasMutated = useRef(false);

  // 닉네임 가져오기 함수 (회원가입용)
  // const getKakaoNickname = async (code: string) => {
  //   const body = new URLSearchParams({
  //     grant_type: 'authorization_code',
  //     client_id: process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY!,
  //     redirect_uri: redirectUri,
  //     code,
  //   }).toString();

  //   console.log('Kakao Token Request Body:', body);
  //   console.log('Redirect URI:', redirectUri);
  //   console.log('Code:', code);

  //   const tokenRes = await fetch('https://kauth.kakao.com/oauth/token', {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' },
  //     body,
  //   });

  //   if (!tokenRes.ok) throw new Error('카카오 access token 발급 실패');
  //   const { access_token } = await tokenRes.json();

  //   const profileRes = await fetch('https://kapi.kakao.com/v2/user/me', {
  //     headers: {
  //       Authorization: `Bearer ${access_token}`,
  //       'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
  //     },
  //   });

  //   if (!profileRes.ok) throw new Error('카카오 사용자 정보 조회 실패');
  //   const profileData = await profileRes.json();

  //   return profileData.kakao_account?.profile?.nickname ?? 'KakaoUser';
  // };

  const signupMutation = useMutation({
    mutationFn: async () => {
      if (!code) throw new Error('카카오 인증 코드가 없습니다.');
      // const nickname = await getKakaoNickname(code);
      const nickname = '카카오톡 유저';

      return await signUpKakao({ token: code, redirectUri, nickname });
    },
    onSuccess: () => {
      router.replace('/'); // 회원가입 후 이동 (백엔드에서 로그인 처리)
    },
    onError: (err) => {
      console.error('회원가입 실패:', err);
      router.replace('/signup');
    },
  });

  // if (code && !hasMutated.current) {
  //   hasMutated.current = true;
  //   signupMutation.mutate();
  // }
  useEffect(() => {
    if (code && !hasMutated.current) {
      hasMutated.current = true;
      signupMutation.mutate();
    }
  }, [code, signupMutation]);

  return <div className='grid place-items-center mt-20'>카카오 회원가입 처리 중...</div>;
};

export default KakaoSignupCallbackPage;
