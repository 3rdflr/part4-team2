import axiosInstance from './axiosInstance';
import { UserSigUp } from '@/types/user.type';

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
  const response = await axiosInstance.post('/users', { email, nickname, password });
  return response.data;
};
