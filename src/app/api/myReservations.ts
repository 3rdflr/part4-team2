import {
  MyReservationCreateRequest,
  MyReservationCreateResponse,
  MyReservationListRequest,
  MyReservationListResponse,
  MyReservationUpdateRequest,
  MyReservationUpdateResponse,
} from '@/types/myReservation.type';
import axiosInstance from '@/app/api/axiosInstance';

/**
 * 내 예약 리스트
 */
export const getMyReservationsList = async (
  params: MyReservationListRequest,
): Promise<MyReservationListResponse> => {
  const response = await axiosInstance.get(`/my-reservations`, { params });
  return response.data;
};

/**
 * 내 예약 수정(취소)
 */
export const updateReservation = async (
  reservationId: number,
  data: MyReservationUpdateRequest,
): Promise<MyReservationUpdateResponse> => {
  const response = await axiosInstance.patch(`/my-reservations/${reservationId}`, data);
  return response.data;
};

/**
 * 내 예약 리뷰 작성
 */
export const createReservationReview = async (
  reservationId: number,
  data: MyReservationCreateRequest,
): Promise<MyReservationCreateResponse> => {
  const response = await axiosInstance.post(`/my-reservations/${reservationId}/reviews`, data);
  return response.data;
};
