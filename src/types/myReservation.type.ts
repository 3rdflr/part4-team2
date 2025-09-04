import { ReservationStatus } from './activities.type';

export interface ReservationActivity {
  bannerImageUrl: string;
  title: string;
  id: number;
}

export interface Reservation {
  id: number;
  teamId: string;
  userId: number;
  activity: ReservationActivity;
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

export interface MyReservationListRequest {
  cursorId?: number;
  size?: number;
  status?: ReservationStatus;
}

export interface MyReservationListResponse {
  cursorId: number;
  totalCount: number;
  reservations: Reservation[];
}

export interface MyReservationUpdateRequest {
  status: ReservationStatus;
}

export interface MyReservationUpdateResponse {
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

export interface MyReservationCreateRequest {
  rating: number;
  content: string;
}

export interface MyReservationCreateResponse {
  updatedAt: string;
  createdAt: string;
  content: string;
  rating: number;
  userId: number;
  activityId: number;
  teamId: string;
  id: number;
}
