import axiosClient from './axiosClient';
import { UserLogin } from '@/types/auth.type';

// 로그인 api
export const login = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<UserLogin> => {
  const response = await axiosClient.post('/auth/login', { email, password });
  return response.data;
};
