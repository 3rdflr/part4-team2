// 카카오 앱 등록
export interface KakaoApp {
  id: number;
  provider: string;
  teamId: string;
  appKey: string;
  createdAt: string;
  updatedAt: string;
}

// 카카오 유저 기본
export interface AppUser {
  id: number;
  email: string;
  nickname: string;
  profileImageUrl: string;
  createdAt: string;
  updatedAt: string;
}

// 카카오 간편 회원가입
export interface AppSignUp {
  user: AppUser;
  refreshToken: string;
  accessToken: string;
}

// 카카오 간편 로그인
export interface AppSignIn {
  user: AppUser;
  refreshToken: string;
  accessToken: string;
}
