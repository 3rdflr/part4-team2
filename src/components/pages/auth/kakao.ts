type kakaoAuthType = 'login' | 'signup';

export const redirectToKakaoAuth = (type: kakaoAuthType) => {
  const REST_API_KEY = process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY!;

  const REDIRECT_URI = encodeURIComponent(
    type === 'signup'
      ? process.env.NEXT_PUBLIC_KAKAO_SIGNUP_REDIRECT_URI!
      : process.env.NEXT_PUBLIC_KAKAO_LOGIN_REDIRECT_URI!,
  );

  const stateParam = type === 'signup' ? '&state=signup' : '';

  const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code${stateParam}`;

  window.location.href = kakaoAuthUrl;
};
