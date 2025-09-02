import { AppSignUp, KakaoApp } from '@/types/oauth.type';
import axiosInstance from './axiosInstance';

// 카카오 등록
export const registerKakao = async (appKey: string): Promise<KakaoApp> => {
  const response = await axiosInstance.post(`/oauth/apps`, { appKey, provider: 'kakao' });
  return response.data;
};

// 카카오 간편 가입
export const signUpKakao = async ({
  nickname,
  redirectUri,
  token,
}: {
  provider: string;
  nickname: string;
  redirectUri: string;
  token: string;
}): Promise<AppSignUp> => {
  const response = await axiosInstance.post('oauth/sign-up/kakao', {
    nickname,
    redirectUri,
    token,
  });
  return response.data;
};

// 카카오 간편 로그인
export const signInKakao = async ({
  redirectUri,
  token,
}: {
  provider: string;
  redirectUri: string;
  token: string;
}): Promise<AppSignUp> => {
  const response = await axiosInstance.post('oauth/sign-in/kakao', {
    redirectUri,
    token,
  });
  return response.data;
};
