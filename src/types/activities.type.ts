// 체험 카테고리 타입
export type ActivitiesCategoryType = '문화 · 예술' | '식음료' | '스포츠' | '투어' | '관광' | '웰빙';

// 체험 조회시 정렬 타입
export type ActivitiesSortType = 'most_reviewed' | 'price_asc' | 'price_desc' | 'latest';

// 예약 상태 타입
export type ReservationStatus = 'pending' | 'confirmed' | 'declined' | 'canceled' | 'completed';

// 예약 상태 텍스트 타입
export type ReservationStatusText =
  | '예약 신청'
  | '예약 승인'
  | '예약 거절'
  | '예약 취소'
  | '체험 완료';

// 컴포넌트에서 사용할 서브 이미지 인터페이스
export interface SubImage {
  id: number;
  imageUrl: string;
}

// 컴포넌트에서 사용할 스케줄 인터페이스
export interface Schedule {
  id: number;
  date: string; // YYYY-MM-DD format
  startTime: string; // HH:mm format
  endTime: string; // HH:mm format
}

// 컴포넌트에서 사용할 스케줄 시간 인터페이스
export interface ScheduleTime {
  id: number;
  startTime: string;
  endTime: string;
}

// 컴포넌트에서 사용할 예약 가능한 스케줄 인터페이스
export interface AvailableSchedule {
  date: string;
  times: ScheduleTime[];
}
export interface SchedulesByDate {
  [date: string]: ScheduleTime[];
}

// 🎯 캐시 가능한 기본 체험 정보 (정적 콘텐츠)
export interface ActivityBasicInfo {
  id: number;
  userId: number;
  title: string;
  description: string;
  category: ActivitiesCategoryType;
  address: string;
  bannerImageUrl: string;
  rating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
}

// 💰 캐시하면 안되는 실시간 가격/예약 정보 (동적 콘텐츠)
export interface ActivityPricingInfo {
  id: number;
  price: number; // 실시간 가격 (할인/프로모션 적용)
  originalPrice?: number; // 원가
  discountRate?: number; // 할인율
  availableSchedules: AvailableSchedule[]; // 실시간 예약 가능 시간
  isAvailable: boolean; // 현재 예약 가능 여부
  maxCapacity: number; // 최대 인원
  currentBookings: number; // 현재 예약 인원
  lastUpdated: string; // 마지막 업데이트 시간
}

// 컴포넌트에서 사용할 기본 체험 인터페이스 (기본 정보만)
export interface Activity extends ActivityBasicInfo {
  price: number; // 기본 가격 (참고용)
}

// 컴포넌트에서 사용할 체험 상세 인터페이스 (기본 정보 + 이미지)
export interface ActivityDetail extends ActivityBasicInfo {
  subImages: SubImage[];
  schedules: Schedule[];
  price: number; // 기본 가격 (참고용)
}

// 🔄 완전한 체험 정보 (기본 정보 + 실시간 정보)
export interface ActivityFullInfo extends ActivityBasicInfo {
  subImages: SubImage[];
  schedules: Schedule[];
  pricingInfo: ActivityPricingInfo;
}

// 체험 카드 표시용 간단한 인터페이스
export interface ActivityCard {
  id: number;
  title: string;
  category: ActivitiesCategoryType;
  price: number;
  address: string;
  bannerImageUrl: string;
  rating: number;
  reviewCount: number;
}

// 체험 생성 폼 데이터
export interface ActivityFormData {
  title: string;
  category: ActivitiesCategoryType;
  description: string;
  address: string;
  price: number;
  schedules: {
    date: string;
    startTime: string;
    endTime: string;
  }[];
  bannerImageUrl: string;
  subImageUrls: string[];
}

// 예약 폼 데이터
export interface ReservationFormData {
  scheduleId: number;
  headCount: number;
}

// 예약 정보 표시용 인터페이스
export interface ReservationInfo {
  id: number;
  activityTitle: string;
  status: ReservationStatus;
  totalPrice: number;
  headCount: number;
  date: string;
  startTime: string;
  endTime: string;
  reviewSubmitted: boolean;
}
