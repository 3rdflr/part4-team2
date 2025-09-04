import { ReservationStatus, ReservationStatusText } from '@/types/activities.type';

// all을 포함한 타입
export type ReservationStatusWithAll = ReservationStatus | 'all';
export type ReservationStatusTextWithAll = ReservationStatusText | '전체';

export const reservationStatus: Record<ReservationStatus, ReservationStatusText> = {
  pending: '예약 신청',
  confirmed: '예약 승인',
  canceled: '예약 취소',
  declined: '예약 거절',
  completed: '체험 완료',
};

// all을 포함한 객체: 전체, 예약 신청, 예약 승인, 예약 취소, 체험 완료
export const reservationStatusAll: Record<ReservationStatusWithAll, ReservationStatusTextWithAll> =
  {
    all: '전체',
    ...reservationStatus,
  };
