import axiosInstance from './axiosInstance';
import {
  UserSigUp,
  UserProfile,
  UserUpdateRequest,
  UploadProfileImageResponse,
} from '@/types/user.type';

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

// 내 정보 조회 api
export const getUserInfo = async (): Promise<UserProfile> => {
  const response = await axiosInstance.get('/users/me');
  return response.data;
};

// 내 정보 수정
export const updateUserInfo = async (data: UserUpdateRequest): Promise<UserProfile> => {
  const response = await axiosInstance.patch('/users/me', data);
  return response.data;
};

// 내 정보 프로필 이미지 생성
export const uploadProfileImage = async (image: File): Promise<UploadProfileImageResponse> => {
  const formData = new FormData();
  formData.append('image', image);

  const response = await axiosInstance.post('/users/me/image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};
