import axiosClient from './axiosClient';
import { UserSigUp, UserProfile } from '@/types/user.type';

// 회원가입 api
export const signup = async ({
  email,
  nickname,
  password,
}: {
  email: string;
  nickname: string;
  password: string;
}): Promise<UserSigUp> => {
  const response = await axiosClient.post('/users', { email, nickname, password });
  return response.data;
};

// 내 정보 조회 api
export const getUserInfo = async (): Promise<UserProfile> => {
  const response = await axiosClient.get('/users/me');
  return response.data;
};
