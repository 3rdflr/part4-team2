import { NextResponse } from 'next/server';
import axiosInstance from '../../axiosInstance';
import axios, { AxiosError } from 'axios';

export async function GET(req: Request) {
  // console.log('KAKAO_KEY:', process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY);
  // console.log('REDIRECT_URI:', process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI);

  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get('code');
    const state = searchParams.get('state');

    console.log('=== 카카오 콜백 시작 ===');
    console.log('code:', code);
    console.log('state:', state);

    if (!code) {
      console.error('Authorization code 없음');
      return NextResponse.json({ error: 'Authorization code 없음' }, { status: 400 });
    }

    // 카카오 토큰 요청
    console.log('토큰 요청 시작...');
    const tokenRes = await axios.post(
      'https://kauth.kakao.com/oauth/token',
      new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY!,
        redirect_uri: process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI!,
        code,
      }),
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        timeout: 10000,
      },
    );

    console.log('토큰 응답:', tokenRes.data);
    const { access_token } = tokenRes.data;

    // 카카오 사용자 정보 요청
    console.log('사용자 정보 요청 시작...');
    const profileRes = await axios.get('https://kapi.kakao.com/v2/user/me', {
      headers: { Authorization: `Bearer ${access_token}` },
      timeout: 10000,
    });

    console.log('사용자 정보:', profileRes.data);
    const nickname = profileRes.data.kakao_account?.profile?.nickname || 'KakaoUser';
    console.log('추출된 닉네임:', nickname);

    // state가 signup이면 회원가입 시도
    if (state === 'signup') {
      console.log('회원가입 시도...');
      try {
        const signupRes = await axiosInstance.post('/oauth/sign-up/kakao', {
          nickname,
          redirectUri: process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI!,
          token: access_token,
        });
        console.log('회원가입 성공:', signupRes.data);
      } catch (error) {
        const signupError = error as AxiosError;

        console.log('이미 가입된 사용자', signupError.response?.data || signupError.message);
        console.log('이미 가입된 사용자로 간주하고 로그인 진행');
        //return NextResponse.redirect(new URL('/', req.url));
      }
    }

    // 백엔드 간편 로그인 API 호출
    console.log('로그인 시도...');
    const loginRes = await axiosInstance.post('/oauth/sign-in/kakao', {
      redirectUri: process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI!,
      token: access_token,
    });

    console.log('로그인 성공:', loginRes.data);
    console.log('=== 카카오 처리 완료 ===');

    return NextResponse.redirect(new URL('/', req.url));
  } catch (error) {
    const routeError = error as AxiosError;

    console.error('=== 카카오 처리 실패 ===');
    console.error('에러 타입:', routeError.constructor.name);
    console.error('에러 메시지:', routeError.message);
    console.error('에러 스택:', routeError.stack);

    if (routeError.response) {
      console.error('응답 상태:', routeError.response.status);
      console.error('응답 데이터:', routeError.response.data);
    }

    if (routeError.request) {
      console.error('요청 정보:', routeError.request);
    }

    return NextResponse.json(
      {
        error: '카카오 처리 실패',
        message: routeError.message,
        details: routeError.response?.data,
      },
      { status: 500 },
    );

    // console.error('카카오 로그인 처리 실패:', error);
    // return NextResponse.json({ error: '카카오 로그인 처리 실패', details: error }, { status: 500 });
  }
}
