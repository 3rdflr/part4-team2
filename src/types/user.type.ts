// 사용자 기본 인터페이스
export interface User {
  id: number;
  nickname: string;
  profileImageUrl: string;
}

// 사용자 프로필 관련 추가 타입들 (필요시 확장)
export interface UserProfile extends User {
  email?: string;
  createdAt?: string;
  updatedAt?: string;
}

// 회원가입
export interface UserSigUp extends User {
  email: string;
  createdAt: string;
  updatedAt: string;
}

// 내 정보 수정 요청
export interface UserUpdateRequest {
  nickname?: string;
  profileImageUrl?: string;
  newPassword?: string;
}

// 내 정보 프로필 이미지 생성 후 응답
export interface UploadProfileImageResponse {
  profileImageUrl: string;
}
