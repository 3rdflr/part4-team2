import { UserSigUp } from './user.type';

// 로그인
export interface UserLogin {
  user: UserSigUp;
  refreshToken: string;
  accessToken: string;
}
