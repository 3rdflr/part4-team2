import { User } from './user.type';

// 리뷰 기본 인터페이스 (컴포넌트에서 사용)
export interface Review {
  id: number;
  user: User;
  activityId: number;
  rating: number;
  content: string;
  createdAt: string;
  updatedAt: string;
}

// 리뷰 목록 표시용 인터페이스
export interface ReviewListItem {
  id: number;
  user: User;
  rating: number;
  content: string;
  createdAt: string;
}

// 리뷰 작성 폼 데이터
export interface ReviewFormData {
  rating: number;
  content: string;
}
