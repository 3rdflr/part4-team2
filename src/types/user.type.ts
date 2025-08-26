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
