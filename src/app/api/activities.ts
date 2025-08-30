import axiosInstance from './axiosInstance';
import {
  ActivitiesCategoryType,
  ActivitiesSortType,
  Activity,
  ActivityDetail,
  SubImage,
  ScheduleTime,
  AvailableSchedule,
  ReservationStatus,
} from '@/types/activities.type';
import { Review } from '@/types/reviews.type';

// API 전용 타입들
export type MethodType = 'offset' | 'cursor';

// API 요청/응답 타입들
export interface ActivityCreateRequest {
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

export interface ActivityCreateResponse extends Activity {
  subImages: SubImage[];
  schedules: {
    date: string;
    times: ScheduleTime[];
  }[];
}

export interface ActivityUpdateRequest {
  title: string;
  category: ActivitiesCategoryType;
  description: string;
  address: string;
  price: number;
  bannerImageUrl: string;
  subImageIdsToRemove: number[];
  subImageUrlsToAdd: string[];
  scheduleIdsToRemove: number[];
  schedulesToAdd: {
    date: string;
    startTime: string;
    endTime: string;
  }[];
}

export interface ActivityUpdateResponse extends Activity {
  subImages: SubImage[];
  schedules: {
    date: string;
    times: ScheduleTime[];
  }[];
}

// API 리스트 타입
export interface ActivitiesListRequest {
  method: MethodType;
  cursorId?: number;
  category?: ActivitiesCategoryType;
  keyword?: string;
  sort?: ActivitiesSortType;
  page?: number;
  size?: number;
}

export interface ActivitiesListResponse {
  cursorId: number;
  totalCount: number;
  activities: Activity[];
}

// API 리뷰 타입
export interface ReviewsRequest {
  page?: number;
  size?: number;
}

export interface ReviewsResponse {
  averageRating: number;
  totalCount: number;
  reviews: Review[];
}

// API 예약 타입
export interface ReservationRequest {
  scheduleId: number;
  headCount: number;
}

export interface ReservationResponse {
  id: number;
  teamId: string;
  userId: number;
  activityId: number;
  scheduleId: number;
  status: ReservationStatus;
  reviewSubmitted: boolean;
  totalPrice: number;
  headCount: number;
  date: string;
  startTime: string;
  endTime: string;
  createdAt: string;
  updatedAt: string;
}

// API 이미지 업로드 타입
export interface ImageUploadResponse {
  activityImageUrl: string;
}

// API 예약 가능 스케줄 타입
export interface AvailableScheduleRequest {
  year: string; // YYYY format
  month: string; // MM format
}

// API Functions
/**
 * 체험 리스트 조회
 */
export const getActivitiesList = async (
  params: ActivitiesListRequest,
): Promise<ActivitiesListResponse> => {
  // 목업 데이터 사용 (개발 단계)
  const { mockActivitiesList } = await import('@/mocks/activities.mock');

  // 실제 API 호출 시뮬레이션을 위한 지연
  await new Promise((resolve) => setTimeout(resolve, 300));

  return {
    cursorId: 0,
    totalCount: mockActivitiesList.length,
    activities: mockActivitiesList.slice(0, params.size || 20),
  };

  // 실제 API 호출 (추후 활성화)
  // const response = await axiosInstance.get('/activities', { params });
  // return response.data;
};

/**
 * 체험 등록
 */
export const createActivity = async (
  data: ActivityCreateRequest,
): Promise<ActivityCreateResponse> => {
  const response = await axiosInstance.post('/activities', data);
  return response.data;
};

/**
 * 체험 상세 조회
 */
export const getActivityDetail = async (activityId: number): Promise<ActivityDetail> => {
  const response = await axiosInstance.get(`/activities/${activityId}`);
  return response.data;
};

/**
 * 체험 수정
 */
export const updateActivity = async (
  activityId: number,
  data: ActivityUpdateRequest,
): Promise<ActivityUpdateResponse> => {
  const response = await axiosInstance.patch(`/my-activities/${activityId}`, data);
  return response.data;
};

/**
 * 체험 예약 가능일 조회
 */
export const getAvailableSchedule = async (
  activityId: number,
  params: AvailableScheduleRequest,
): Promise<AvailableSchedule[]> => {
  const response = await axiosInstance.get(`/activities/${activityId}/available-schedule`, {
    params,
  });
  return response.data;
};

/**
 * 체험 리뷰 조회
 */
export const getActivityReviews = async (
  activityId: number,
  params?: ReviewsRequest,
): Promise<ReviewsResponse> => {
  const response = await axiosInstance.get(`/activities/${activityId}/reviews`, { params });
  return response.data;
};

/**
 * 체험 예약 신청
 */
export const createReservation = async (
  activityId: number,
  data: ReservationRequest,
): Promise<ReservationResponse> => {
  const response = await axiosInstance.post(`/activities/${activityId}/reservations`, data);
  return response.data;
};

/**
 * 체험 이미지 URL 생성
 */
export const uploadActivityImage = async (image: File): Promise<ImageUploadResponse> => {
  const formData = new FormData();
  formData.append('image', image);

  const response = await axiosInstance.post('/activities/image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};
